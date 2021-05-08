<?php
/**
 * @package custom-html-block-extension
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace custom_html_block_extension;

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

		register_rest_route(
			CHBE_NAMESPACE . '/v1',
			'/get_editor_config',
			array(
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'get_editor_config' ),
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				),
			)
		);

		register_rest_route(
			CHBE_NAMESPACE . '/v1',
			'/update_editor_config',
			array(
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'update_editor_config' ),
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				),
			)
		);

		register_rest_route(
			CHBE_NAMESPACE . '/v1',
			'/delete_editor_config',
			array(
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'delete_editor_config' ),
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				),
			)
		);

		register_rest_route(
			CHBE_NAMESPACE . '/v1',
			'/dismiss_welcome_guide',
			array(
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'dismiss_welcome_guide' ),
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				),
			)
		);
	}

	/**
	 * Function to get editor config.
	 */
	public function get_editor_config() {
		// Override default editor settings with option values.
		$default_editor_settings = array();

		foreach ( Settings::DEFAULT_EDITOR_SETTINGS as $key => $value ) {
			$default_editor_settings[ $key ] = $value['default'];
		}
		$current_editor_settings = get_option( Settings::OPTION_NAME['editor_settings'] );
		$editor_settings         = array_merge( $default_editor_settings, $current_editor_settings );

		// Override default editor options with option values.
		$default_editor_options = array();

		foreach ( Settings::DEFAULT_EDITOR_OPTIONS as $key => $value ) {
			if ( $value['type'] === 'object' ) {
				$default_editor_options[ $key ] = array();

				foreach ( $value['items'] as $sub_key => $sub_value ) {
					$default_editor_options[ $key ][ $sub_key ] = $sub_value['default'];
				}
			} else {
				$default_editor_options[ $key ] = $value['default'];
			}
		}

		$current_editor_options = get_option( Settings::OPTION_NAME['editor_options'] );
		$editor_options         = array_merge( $default_editor_options, $current_editor_options );

		return rest_ensure_response(
			array(
				'editorSettings' => $editor_settings,
				'editorOptions'  => $editor_options,
			)
		);
	}

	/**
	 * Function to update editor config.
	 */
	public function update_editor_config( $request ) {
		$json_params = $request->get_json_params();

		if ( ! isset( $json_params['editorSettings'] ) || ! isset( $json_params['editorOptions'] ) ) {
			return rest_ensure_response(
				array(
					'success' => false,
					'message' => __( 'An unknown error occurred.', 'custom-html-block-extension' ),
				)
			);
		}

		if ( ! is_array( $json_params['editorSettings'] ) || ! is_array( $json_params['editorOptions'] ) ) {
			return rest_ensure_response(
				array(
					'success' => false,
					'message' => __( 'An unknown error occurred.', 'custom-html-block-extension' ),
				)
			);
		}

		update_option( Settings::OPTION_NAME['editor_settings'], $json_params['editorSettings'] );
		update_option( Settings::OPTION_NAME['editor_options'], $json_params['editorOptions'] );

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

		delete_option( Settings::OPTION_NAME['editor_settings'] );
		delete_option( Settings::OPTION_NAME['editor_options'] );

		// Get default editor config to return.
		$editor_settings = get_option( Settings::OPTION_NAME['editor_settings'] );
		$editor_options  = get_option( Settings::OPTION_NAME['editor_options'] );

		return rest_ensure_response(
			array(
				'success'        => true,
				'message'        => __( 'Settings have been reset.', 'custom-html-block-extension' ),
				'editorSettings' => $editor_settings,
				'editorOptions'  => $editor_options,
			)
		);
	}

	/**
	 * Function to dismiss welcome guide.
	 */
	public function dismiss_welcome_guide() {
		update_option( Settings::OPTION_NAME['dismiss_welcome_guide'], 1 );
		return array();
	}
}

new Api();
