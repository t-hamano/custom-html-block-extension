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
	}

	/**
	 * Register REST API route
	 */
	public function register_routes() {
		$routes = array(
			'get_editor_config',
			'update_editor_config',
			'delete_editor_config',
			'update_options',
			'dismiss_welcome_guide',
			'import_editor_config',
		);

		foreach ( $routes as $route ) {
			register_rest_route(
				CHBE_NAMESPACE . '/v1',
				'/' . $route,
				array(
					array(
						'methods'             => 'POST',
						'callback'            => array( $this, $route ),
						'permission_callback' => static function () {
							return current_user_can( 'manage_options' );
						},
					),
				)
			);
		}

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
	}

	/**
	 * Function to get editor config.
	 */
	public function get_editor_config() {
		return rest_ensure_response(
			array(
				'editorSettings' => Settings::get_editor_settings(),
				'editorOptions'  => Settings::get_editor_options(),
			)
		);
	}

	/**
	 * Function to update editor config.
	 */
	public function update_editor_config( $request ) {
		$json_params = $request->get_json_params();

		update_option( Option::OPTION_NAMES['editor_settings'], $json_params['editorSettings'] );
		update_option( Option::OPTION_NAMES['editor_options'], $json_params['editorOptions'] );

		return rest_ensure_response(
			array(
				'success' => true,
				'message' => __( 'Settings saved.', 'custom-html-block-extension' ),
			)
		);
	}

	/**
	 * Function to delete editor config.
	 */
	public function delete_editor_config() {

		delete_option( Option::OPTION_NAMES['editor_settings'] );
		delete_option( Option::OPTION_NAMES['editor_options'] );

		// Return default editor config.
		return rest_ensure_response(
			array(
				'editorSettings' => Settings::get_editor_settings(),
				'editorOptions'  => Settings::get_editor_options(),
			)
		);
	}

	/**
	 * Function to update options.
	 */
	public function update_options( $request ) {
		$json_params = $request->get_json_params();

		update_option( Option::OPTION_NAMES['options'], $json_params['options'] );

		return rest_ensure_response(
			array(
				'success' => true,
				'message' => __( 'Options saved.', 'custom-html-block-extension' ),
			)
		);
	}

	/**
	 * Function to dismiss welcome guide.
	 */
	public function dismiss_welcome_guide() {
		update_option( Option::OPTION_NAMES['dismiss_welcome_guide'], 1 );
		return array();
	}

	/**
	 * Function to import editor config.
	 */
	public function import_editor_config( $request ) {
		$json_params = $request->get_json_params();

		// Update editor config.
		update_option( Option::OPTION_NAMES['editor_settings'], $json_params['editorSettings'] );
		update_option( Option::OPTION_NAMES['editor_options'], $json_params['editorOptions'] );

		// Return new editor config.
		return rest_ensure_response(
			array(
				'editorSettings' => Settings::get_editor_settings(),
				'editorOptions'  => Settings::get_editor_options(),
			)
		);
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
