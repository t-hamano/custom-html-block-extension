<?php
/**
 * Plugin Name: Custom HTML Block Extension Test Helpers
 * Description: Helpers for the e2e tests.
 *
 * @package Custom_Html_Block_Extension
 */

// Save an option of the plugin as is, bypassing the REST API sanitization,
// to reproduce values persisted by older plugin versions.
add_action(
	'rest_api_init',
	static function () {
		register_rest_route(
			'chbe-test/v1',
			'/update_option',
			array(
				'methods'             => 'POST',
				'callback'            => static function ( $request ) {
					update_option( $request['name'], $request['value'] );
					return rest_ensure_response( array( 'success' => true ) );
				},
				'permission_callback' => static function () {
					return current_user_can( 'manage_options' );
				},
				'args'                => array(
					'name'  => array(
						'type'     => 'string',
						'required' => true,
						'pattern'  => '^custom_html_block_extension_',
					),
					'value' => array(
						'required' => true,
					),
				),
			)
		);
	}
);
