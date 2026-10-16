<?php
/**
 * @package Custom_Html_Block_Extension
 */

use Custom_Html_Block_Extension\Api;
use Custom_Html_Block_Extension\Option;

class Test_Api extends WP_UnitTestCase {

	/**
	 * @dataProvider data_validate_json_schema_url
	 */
	public function test_validate_json_schema_url( $url, $expected ) {
		$this->assertSame( $expected, ( new Api() )->validate_json_schema_url( $url ) );
	}

	public function data_validate_json_schema_url() {
		return array(
			'schemas.wp.org'        => array( 'https://schemas.wp.org/trunk/theme.json', true ),
			'http'                  => array( 'http://schemas.wp.org/trunk/theme.json', false ),
			'other host'            => array( 'https://example.com/theme.json', false ),
			'subdomain'             => array( 'https://schemas.wp.org.example.com/trunk/theme.json', false ),
			'host in path'          => array( 'https://example.com/schemas.wp.org/theme.json', false ),
			'host in credentials'   => array( 'https://schemas.wp.org@example.com/theme.json', false ),
			'protocol-relative URL' => array( '//schemas.wp.org/trunk/theme.json', false ),
			'not a string'          => array( array( 'https://schemas.wp.org/trunk/theme.json' ), false ),
		);
	}

	/**
	 * @dataProvider data_settings_routes
	 */
	public function test_settings_routes_require_manage_options( $method, $role, $status ) {
		wp_set_current_user( self::factory()->user->create( array( 'role' => $role ) ) );

		$request = new WP_REST_Request( $method, '/wp/v2/settings' );
		if ( 'POST' === $method ) {
			$request->set_param( Option::OPTION_NAMES['editor_settings'], array( 'tabSize' => 4 ) );
			$request->set_param( Option::OPTION_NAMES['editor_options'], array( 'fontSize' => 20 ) );
			$request->set_param( Option::OPTION_NAMES['options'], array( 'permissionBlockEditor' => false ) );
		}

		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( $status, $response->get_status() );
	}

	public function data_settings_routes() {
		return array(
			'GET as administrator'  => array( 'GET', 'administrator', 200 ),
			'GET as editor'         => array( 'GET', 'editor', 403 ),
			'POST as administrator' => array( 'POST', 'administrator', 200 ),
			'POST as editor'        => array( 'POST', 'editor', 403 ),
		);
	}

	public function test_settings_route_returns_plugin_settings_for_administrator() {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );

		$data = rest_get_server()->dispatch( new WP_REST_Request( 'GET', '/wp/v2/settings' ) )->get_data();

		$this->assertArrayHasKey( Option::OPTION_NAMES['editor_settings'], $data );
		$this->assertArrayHasKey( Option::OPTION_NAMES['editor_options'], $data );
		$this->assertArrayHasKey( Option::OPTION_NAMES['options'], $data );
	}

	public function test_validate_editor_config_route() {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );

		$request = new WP_REST_Request( 'POST', '/custom-html-block-extension/v1/validate_editor_config' );
		$request->set_body_params(
			array(
				'editorSettings' => array(
					'tabSize' => 20,
					'emmet'   => false,
				),
				'editorOptions'  => array(
					'fontSize'           => 40,
					'lineNumbers'        => 'off',
					'renderIndentGuides' => false,
					'hover'              => true,
				),
			)
		);

		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 200, $response->get_status() );
		$this->assertEquals(
			array(
				'editorSettings' => (object) array( 'emmet' => false ),
				'editorOptions'  => (object) array(
					'lineNumbers' => 'off',
					'hover'       => array( 'enabled' => 'on' ),
					'guides'      => array( 'indentation' => false ),
				),
				'skipped'        => array( 'tabSize', 'fontSize' ),
			),
			$response->get_data()
		);
		// The editor config should not be saved.
		$this->assertFalse( get_option( Option::OPTION_NAMES['editor_options'] ) );
	}

	public function test_validate_editor_config_route_requires_manage_options() {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'editor' ) ) );

		$request = new WP_REST_Request( 'POST', '/custom-html-block-extension/v1/validate_editor_config' );

		$this->assertSame( 403, rest_get_server()->dispatch( $request )->get_status() );
	}

	public function test_json_schema_route_requires_edit_themes_or_edit_plugins() {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'editor' ) ) );

		$request = new WP_REST_Request( 'GET', '/custom-html-block-extension/v1/get_json_schema' );
		$request->set_query_params( array( 'url' => 'https://schemas.wp.org/trunk/theme.json' ) );

		$this->assertSame( 403, rest_get_server()->dispatch( $request )->get_status() );
	}
}
