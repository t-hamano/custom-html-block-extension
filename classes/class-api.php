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

		update_option( Settings::OPTION_NAME['options'], $json_params['options'] );

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
		update_option( Settings::OPTION_NAME['dismiss_welcome_guide'], 1 );
		return array();
	}

	/**
	 * Function to import editor config.
	 */
	public function import_editor_config( $request ) {
		$json_params = $request->get_json_params();

		// Update editor config.
		update_option( Settings::OPTION_NAME['editor_settings'], $json_params['editorSettings'] );
		update_option( Settings::OPTION_NAME['editor_options'], $json_params['editorOptions'] );

		// Return new editor config.
		return rest_ensure_response(
			array(
				'editorSettings' => Settings::get_editor_settings(),
				'editorOptions'  => Settings::get_editor_options(),
			)
		);
	}
}

new Api();
