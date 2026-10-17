<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

class Api {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Register REST API route
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		// Adjust the plugin settings in `/wp/v2/settings`
		add_filter( 'rest_pre_get_setting', array( $this, 'get_setting' ), 10, 3 );
		add_filter( 'rest_pre_update_setting', array( $this, 'delete_setting' ), 10, 4 );
	}

	/**
	 * Register REST API route
	 */
	public function register_routes() {
		register_rest_route(
			CHBE_NAMESPACE . '/v1',
			'/get_json_schema',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_json_schema' ),
					'permission_callback' => static function () {
						return current_user_can( 'edit_themes' ) || current_user_can( 'edit_plugins' );
					},
					'args'                => array(
						'url' => array(
							'type'              => 'string',
							'required'          => true,
							'validate_callback' => array( $this, 'validate_json_schema_url' ),
						),
					),
				),
			)
		);

		register_rest_route(
			CHBE_NAMESPACE . '/v1',
			'/validate_editor_config',
			array(
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'validate_editor_config' ),
					'permission_callback' => static function () {
						return current_user_can( 'manage_options' );
					},
					'args'                => array(
						'editorSettings' => array(
							'type'    => 'object',
							'default' => array(),
						),
						'editorOptions'  => array(
							'type'    => 'object',
							'default' => array(),
						),
					),
				),
			)
		);
	}

	/**
	 * Validate an imported editor config without saving it.
	 *
	 * Legacy values are migrated, and unknown properties and values that don't
	 * match the settings schema are removed, so the result can be saved. Values
	 * that are not given stay missing, so the client keeps the current values.
	 */
	public function validate_editor_config( $request ) {
		$editor_settings = Settings::remove_invalid_values(
			$request['editorSettings'],
			Settings::DEFAULT_EDITOR_SETTINGS
		);
		$editor_options  = Settings::remove_invalid_values(
			Settings::clamp_rulers( Settings::migrate_legacy_editor_options( $request['editorOptions'] ) ),
			Settings::DEFAULT_EDITOR_OPTIONS
		);

		return rest_ensure_response(
			array(
				// Cast to objects so that empty values are encoded as `{}`.
				'editorSettings' => (object) $editor_settings['values'],
				'editorOptions'  => (object) $editor_options['values'],
				'skipped'        => array_merge( $editor_settings['skipped'], $editor_options['skipped'] ),
			)
		);
	}

	/**
	 * Return the settings merged with the defaults from `/wp/v2/settings`, so that
	 * properties added later and legacy values are resolved as in the editors.
	 */
	public function get_setting( $result, $name, $args ) {
		if ( null !== $result ) {
			return $result;
		}

		switch ( $args['option_name'] ) {
			case Option::OPTION_NAMES['editor_settings']:
				return Settings::get_editor_settings();
			case Option::OPTION_NAMES['editor_options']:
				return Settings::get_editor_options();
			case Option::OPTION_NAMES['options']:
				return Settings::get_options();
		}

		return $result;
	}

	/**
	 * Delete the setting when `/wp/v2/settings` receives `null`.
	 *
	 * Core refuses to delete an option whose stored value doesn't match the
	 * schema, which is the case for values saved by older versions, so the
	 * settings couldn't be reset.
	 */
	public function delete_setting( $updated, $name, $value, $args ) {
		$option_names = array(
			Option::OPTION_NAMES['editor_settings'],
			Option::OPTION_NAMES['editor_options'],
			Option::OPTION_NAMES['options'],
		);

		if ( $updated || null !== $value || ! in_array( $args['option_name'], $option_names, true ) ) {
			return $updated;
		}

		delete_option( $args['option_name'] );

		return true;
	}

	/**
	 * Function to get a JSON schema.
	 *
	 * The browser can't fetch the schema directly because schemas.wp.org redirects
	 * to GitHub without CORS headers, so the server fetches it instead.
	 */
	public function get_json_schema( $request ) {
		$url       = $request->get_param( 'url' );
		$cache_key = 'chbe_json_schema_' . md5( $url );
		$schema    = get_transient( $cache_key );

		if ( false === $schema ) {
			$response = wp_safe_remote_get( $url );
			$schema   = json_decode( wp_remote_retrieve_body( $response ) );

			if ( 200 !== wp_remote_retrieve_response_code( $response ) || ! is_object( $schema ) ) {
				return new \WP_Error(
					'chbe_json_schema_not_found',
					__( 'Failed to load the JSON schema.', 'custom-html-block-extension' ),
					array( 'status' => 404 )
				);
			}

			set_transient( $cache_key, $schema, DAY_IN_SECONDS );
		}

		return rest_ensure_response( $schema );
	}

	/**
	 * Allow only schemas on schemas.wp.org so that the endpoint can't be used
	 * to fetch arbitrary URLs.
	 */
	public function validate_json_schema_url( $url ) {
		return is_string( $url )
			&& 'https' === wp_parse_url( $url, PHP_URL_SCHEME )
			&& 'schemas.wp.org' === wp_parse_url( $url, PHP_URL_HOST );
	}
}

new Api();
