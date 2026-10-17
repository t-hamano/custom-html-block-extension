<?php
/**
 * @package Custom_Html_Block_Extension
 */

use Custom_Html_Block_Extension\Option;
use Custom_Html_Block_Extension\Settings;

class Test_Settings extends WP_UnitTestCase {

	/**
	 * @dataProvider data_migrate_legacy_editor_options
	 */
	public function test_migrate_legacy_editor_options( $legacy, $expected ) {
		$this->assertSame( $expected, Settings::migrate_legacy_editor_options( $legacy ) );
	}

	public function data_migrate_legacy_editor_options() {
		return array(
			'acceptSuggestionOnEnter true'             => array(
				array( 'acceptSuggestionOnEnter' => true ),
				array( 'acceptSuggestionOnEnter' => 'on' ),
			),
			'acceptSuggestionOnEnter false'            => array(
				array( 'acceptSuggestionOnEnter' => false ),
				array( 'acceptSuggestionOnEnter' => 'off' ),
			),
			'cursorSmoothCaretAnimation true'          => array(
				array( 'cursorSmoothCaretAnimation' => true ),
				array( 'cursorSmoothCaretAnimation' => 'on' ),
			),
			'cursorSmoothCaretAnimation false'         => array(
				array( 'cursorSmoothCaretAnimation' => false ),
				array( 'cursorSmoothCaretAnimation' => 'off' ),
			),
			'occurrencesHighlight true'                => array(
				array( 'occurrencesHighlight' => true ),
				array( 'occurrencesHighlight' => 'singleFile' ),
			),
			'occurrencesHighlight false'               => array(
				array( 'occurrencesHighlight' => false ),
				array( 'occurrencesHighlight' => 'off' ),
			),
			'occurrencesHighlight multiFile'           => array(
				array( 'occurrencesHighlight' => 'multiFile' ),
				array( 'occurrencesHighlight' => 'singleFile' ),
			),
			'renderFinalNewline true'                  => array(
				array( 'renderFinalNewline' => true ),
				array( 'renderFinalNewline' => 'on' ),
			),
			'renderFinalNewline false'                 => array(
				array( 'renderFinalNewline' => false ),
				array( 'renderFinalNewline' => 'off' ),
			),
			'find.seedSearchStringFromSelection true'  => array(
				array( 'find' => array( 'seedSearchStringFromSelection' => true ) ),
				array( 'find' => array( 'seedSearchStringFromSelection' => 'always' ) ),
			),
			'find.seedSearchStringFromSelection false' => array(
				array( 'find' => array( 'seedSearchStringFromSelection' => false ) ),
				array( 'find' => array( 'seedSearchStringFromSelection' => 'never' ) ),
			),
			'hover true'                               => array(
				array( 'hover' => true ),
				array( 'hover' => array( 'enabled' => 'on' ) ),
			),
			'hover false'                              => array(
				array( 'hover' => false ),
				array( 'hover' => array( 'enabled' => 'off' ) ),
			),
			'hover.enabled true'                       => array(
				array( 'hover' => array( 'enabled' => true ) ),
				array( 'hover' => array( 'enabled' => 'on' ) ),
			),
			'hover.enabled false'                      => array(
				array( 'hover' => array( 'enabled' => false ) ),
				array( 'hover' => array( 'enabled' => 'off' ) ),
			),
			'legacy guides without guides'             => array(
				array(
					'renderIndentGuides'         => false,
					'highlightActiveIndentGuide' => false,
				),
				array(
					'guides' => array(
						'indentation'                => false,
						'highlightActiveIndentation' => false,
					),
				),
			),
			'legacy guide overrides guides'            => array(
				array(
					'guides'             => array(
						'highlightActiveIndentation' => true,
						'indentation'                => true,
					),
					'renderIndentGuides' => false,
				),
				array(
					'guides' => array(
						'highlightActiveIndentation' => true,
						'indentation'                => false,
					),
				),
			),
			'quickSuggestions true'                    => array(
				array( 'quickSuggestions' => true ),
				array(
					'quickSuggestions' => array(
						'other'    => 'on',
						'comments' => 'on',
						'strings'  => 'on',
					),
				),
			),
			'quickSuggestions false'                   => array(
				array( 'quickSuggestions' => false ),
				array(
					'quickSuggestions' => array(
						'other'    => 'off',
						'comments' => 'off',
						'strings'  => 'off',
					),
				),
			),
			'rulers 0'                                 => array(
				array( 'rulers' => 0 ),
				array( 'rulers' => array() ),
			),
		);
	}

	public function test_migrate_legacy_editor_options_keeps_current_values() {
		$current = array(
			'acceptSuggestionOnEnter'    => 'smart',
			'cursorSmoothCaretAnimation' => 'explicit',
			'occurrencesHighlight'       => 'singleFile',
			'renderFinalNewline'         => 'dimmed',
			'find'                       => array( 'seedSearchStringFromSelection' => 'selection' ),
			'hover'                      => array( 'enabled' => 'onKeyboardModifier' ),
			'guides'                     => array(
				'highlightActiveIndentation' => false,
				'indentation'                => true,
			),
			'quickSuggestions'           => array(
				'other'    => 'inline',
				'comments' => 'off',
				'strings'  => 'on',
			),
			'rulers'                     => array(
				80,
				array(
					'column' => 100,
					'color'  => '#ff0000',
				),
			),
		);

		$this->assertSame( $current, Settings::migrate_legacy_editor_options( $current ) );
	}

	public function test_get_editor_options_returns_defaults() {
		$editor_options = Settings::get_editor_options();

		$this->assertSame( array_keys( Settings::DEFAULT_EDITOR_OPTIONS ), array_keys( $editor_options ) );
		$this->assertSame( 14, $editor_options['fontSize'] );
		$this->assertSame(
			wp_list_pluck( Settings::DEFAULT_EDITOR_OPTIONS['minimap']['items'], 'default' ),
			$editor_options['minimap']
		);
	}

	public function test_get_editor_options_merges_nested_defaults() {
		// Simulate an object option saved before a property was added to it.
		update_option(
			Option::OPTION_NAMES['editor_options'],
			array(
				'fontSize' => 20,
				'minimap'  => array( 'enabled' => false ),
			)
		);

		$editor_options = Settings::get_editor_options();
		$expected       = array_merge(
			wp_list_pluck( Settings::DEFAULT_EDITOR_OPTIONS['minimap']['items'], 'default' ),
			array( 'enabled' => false )
		);

		$this->assertSame( 20, $editor_options['fontSize'] );
		$this->assertSame( $expected, $editor_options['minimap'] );
	}

	public function test_get_editor_options_merges_nested_defaults_into_legacy_values() {
		// `hover` was persisted as a boolean by older versions.
		update_option( Option::OPTION_NAMES['editor_options'], array( 'hover' => false ) );

		$editor_options = Settings::get_editor_options();
		$expected       = array_merge(
			wp_list_pluck( Settings::DEFAULT_EDITOR_OPTIONS['hover']['items'], 'default' ),
			array( 'enabled' => 'off' )
		);

		$this->assertSame( $expected, $editor_options['hover'] );
	}

	public function test_get_editor_options_migrates_legacy_guides() {
		update_option(
			Option::OPTION_NAMES['editor_options'],
			array( 'renderIndentGuides' => false )
		);

		$editor_options = Settings::get_editor_options();

		$this->assertFalse( $editor_options['guides']['indentation'] );
		$this->assertArrayNotHasKey( 'renderIndentGuides', $editor_options );
	}

	public function test_get_editor_options_resets_invalid_values() {
		// Simulate values saved before the allowed values or ranges were narrowed.
		update_option(
			Option::OPTION_NAMES['editor_options'],
			array(
				'fontSize'         => 40,
				'cursorStyle'      => 'foo',
				'renderWhitespace' => 'foo',
				'lineNumbers'      => 'relative',
				'hover'            => array(
					'enabled' => 'on',
					'delay'   => 5000,
				),
				'minimap'          => 'foo',
			)
		);

		$editor_options = Settings::get_editor_options();
		$defaults       = Settings::get_defaults( Settings::DEFAULT_EDITOR_OPTIONS );

		$this->assertSame( $defaults['fontSize'], $editor_options['fontSize'] );
		$this->assertSame( $defaults['cursorStyle'], $editor_options['cursorStyle'] );
		$this->assertSame( $defaults['renderWhitespace'], $editor_options['renderWhitespace'] );
		$this->assertSame( 'relative', $editor_options['lineNumbers'] );
		$this->assertSame( 'on', $editor_options['hover']['enabled'] );
		$this->assertSame( $defaults['hover']['delay'], $editor_options['hover']['delay'] );
		$this->assertSame( $defaults['minimap'], $editor_options['minimap'] );
		$this->assertTrue(
			rest_validate_value_from_schema( $editor_options, Settings::get_schema( Settings::DEFAULT_EDITOR_OPTIONS ) )
		);
	}

	public function test_get_editor_settings_resets_invalid_values() {
		update_option(
			Option::OPTION_NAMES['editor_settings'],
			array( 'tabSize' => 20 )
		);

		$editor_settings = Settings::get_editor_settings();

		$this->assertSame( Settings::DEFAULT_EDITOR_SETTINGS['tabSize']['default'], $editor_settings['tabSize'] );
	}

	public function test_remove_invalid_values() {
		$result = Settings::remove_invalid_values(
			array(
				'fontSize'    => '20',
				'cursorStyle' => 'foo',
				'tabSize'     => 4,
				'hover'       => array(
					'enabled' => 'off',
					'delay'   => 5000,
				),
				'minimap'     => 'foo',
				'rulers'      => array( 80 ),
			),
			Settings::DEFAULT_EDITOR_OPTIONS
		);

		$this->assertSame(
			array(
				'fontSize' => 20.0,
				'hover'    => array(
					'enabled' => 'off',
					'delay'   => 3000.0,
				),
				'rulers'   => array( 80.0 ),
			),
			$result['values']
		);
		$this->assertSame( array( 'cursorStyle', 'tabSize', 'minimap' ), $result['skipped'] );
	}

	public function test_clamp_to_schema() {
		$schema = Settings::get_schema( Settings::DEFAULT_EDITOR_OPTIONS );

		$this->assertSame( 30, Settings::clamp_to_schema( 40, $schema['properties']['fontSize'] ) );
		$this->assertSame( 10, Settings::clamp_to_schema( 5, $schema['properties']['fontSize'] ) );
		$this->assertSame( '40', Settings::clamp_to_schema( '40', $schema['properties']['fontSize'] ) );
		$this->assertSame(
			array(
				80,
				100,
				array(
					'column' => 100,
					'color'  => '#ff0000',
				),
				1,
			),
			Settings::clamp_to_schema(
				array(
					80,
					120,
					array(
						'column' => 10000,
						'color'  => '#ff0000',
					),
					0,
				),
				$schema['properties']['rulers']
			)
		);
	}

	public function test_get_schema() {
		$schema = Settings::get_schema(
			array(
				'scalar' => array(
					'type'    => 'string',
					'enum'    => array( 'foo', 'bar' ),
					'default' => 'foo',
				),
				'number' => array(
					'type'    => 'number',
					'minimum' => 1,
					'maximum' => 10,
					'default' => 5,
				),
				'object' => array(
					'type'  => 'object',
					'items' => array(
						'enabled' => array(
							'type'    => 'boolean',
							'default' => true,
						),
						'mixed'   => array(
							'type'    => array( 'boolean', 'string' ),
							'enum'    => array( true, 'active', false ),
							'default' => false,
						),
					),
				),
				'array'  => array(
					'type'    => 'array',
					'items'   => array(
						'type' => 'string',
					),
					'default' => array(),
				),
			)
		);

		$this->assertSame(
			array(
				'type'       => 'object',
				'properties' => array(
					'scalar' => array(
						'type' => 'string',
						'enum' => array( 'foo', 'bar' ),
					),
					'number' => array(
						'type'    => 'number',
						'minimum' => 1,
						'maximum' => 10,
					),
					'object' => array(
						'type'       => 'object',
						'properties' => array(
							'enabled' => array(
								'type' => 'boolean',
							),
							'mixed'   => array(
								'type' => array( 'boolean', 'string' ),
								'enum' => array( true, 'active', false ),
							),
						),
					),
					'array'  => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'string',
						),
					),
				),
			),
			$schema
		);
	}

	public function test_schema_accepts_defaults() {
		$this->assertTrue(
			rest_validate_value_from_schema(
				Settings::get_defaults( Settings::DEFAULT_EDITOR_SETTINGS ),
				Settings::get_schema( Settings::DEFAULT_EDITOR_SETTINGS )
			)
		);
		$this->assertTrue(
			rest_validate_value_from_schema(
				Settings::get_defaults( Settings::DEFAULT_EDITOR_OPTIONS ),
				Settings::get_schema( Settings::DEFAULT_EDITOR_OPTIONS )
			)
		);
	}

	/**
	 * @dataProvider data_schema_validates_editor_options
	 */
	public function test_schema_validates_editor_options( $editor_options, $expected ) {
		$result = rest_validate_value_from_schema(
			$editor_options,
			Settings::get_schema( Settings::DEFAULT_EDITOR_OPTIONS )
		);

		$this->assertSame( $expected, ! is_wp_error( $result ) );
	}

	public function data_schema_validates_editor_options() {
		return array(
			'valid enum'                   => array( array( 'cursorStyle' => 'block' ), true ),
			'invalid enum'                 => array( array( 'cursorStyle' => 'foo' ), false ),
			'valid nested enum'            => array( array( 'minimap' => array( 'size' => 'fit' ) ), true ),
			'invalid nested enum'          => array( array( 'minimap' => array( 'size' => 'foo' ) ), false ),
			'boolean in mixed enum'        => array( array( 'guides' => array( 'bracketPairs' => true ) ), true ),
			'string in mixed enum'         => array( array( 'guides' => array( 'bracketPairs' => 'active' ) ), true ),
			'invalid string in mixed enum' => array( array( 'guides' => array( 'bracketPairs' => 'always' ) ), false ),
			'minimum'                      => array( array( 'fontSize' => 10 ), true ),
			'maximum'                      => array( array( 'fontSize' => 30 ), true ),
			'below minimum'                => array( array( 'fontSize' => 9 ), false ),
			'above maximum'                => array( array( 'fontSize' => 31 ), false ),
			'negative minimum'             => array( array( 'letterSpacing' => -2 ), true ),
			'below negative minimum'       => array( array( 'letterSpacing' => -2.1 ), false ),
			'nested above maximum'         => array( array( 'hover' => array( 'delay' => 3001 ) ), false ),
		);
	}

	/**
	 * @dataProvider data_settings_route_validates_values
	 */
	public function test_settings_route_validates_values( $option, $value, $status ) {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );

		$request = new WP_REST_Request( 'POST', '/wp/v2/settings' );
		$request->set_param( Option::OPTION_NAMES[ $option ], $value );

		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( $status, $response->get_status() );
		if ( 400 === $status ) {
			$this->assertSame( 'rest_invalid_param', $response->get_data()['code'] );
		}
	}

	public function data_settings_route_validates_values() {
		return array(
			'valid tabSize'              => array( 'editor_settings', array( 'tabSize' => 8 ), 200 ),
			'tabSize above maximum'      => array( 'editor_settings', array( 'tabSize' => 9 ), 400 ),
			'valid cursorStyle'          => array( 'editor_options', array( 'cursorStyle' => 'underline' ), 200 ),
			'invalid cursorStyle'        => array( 'editor_options', array( 'cursorStyle' => 'foo' ), 400 ),
			'valid scrollbar.vertical'   => array( 'editor_options', array( 'scrollbar' => array( 'vertical' => 'hidden' ) ), 200 ),
			'invalid scrollbar.vertical' => array( 'editor_options', array( 'scrollbar' => array( 'vertical' => 'foo' ) ), 400 ),
			'valid fontSize'             => array( 'editor_options', array( 'fontSize' => 20 ), 200 ),
			'fontSize below minimum'     => array( 'editor_options', array( 'fontSize' => 0 ), 400 ),
			'fontSize above maximum'     => array( 'editor_options', array( 'fontSize' => 100 ), 400 ),
		);
	}

	public function test_is_allowed_user_returns_false_for_logged_out_user() {
		wp_set_current_user( 0 );

		$this->assertFalse( Settings::is_allowed_user() );
	}

	/**
	 * @dataProvider data_is_allowed_user_with_default_roles
	 */
	public function test_is_allowed_user_with_default_roles( $role, $expected ) {
		wp_set_current_user( self::factory()->user->create( array( 'role' => $role ) ) );

		$this->assertSame( $expected, Settings::is_allowed_user() );
	}

	public function data_is_allowed_user_with_default_roles() {
		return array(
			'administrator' => array( 'administrator', true ),
			'editor'        => array( 'editor', true ),
			'author'        => array( 'author', true ),
			'contributor'   => array( 'contributor', true ),
			'subscriber'    => array( 'subscriber', false ),
		);
	}

	public function test_is_allowed_user_with_custom_roles() {
		update_option( Option::OPTION_NAMES['options'], array( 'permissionRoles' => array( 'editor' ) ) );

		wp_set_current_user( self::factory()->user->create( array( 'role' => 'editor' ) ) );
		$this->assertTrue( Settings::is_allowed_user() );

		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );
		$this->assertFalse( Settings::is_allowed_user() );
	}
}
