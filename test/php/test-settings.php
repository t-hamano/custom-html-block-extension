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
						'bracketPairs'               => false,
						'bracketPairsHorizontal'     => 'active',
						'highlightActiveBracketPair' => true,
						'highlightActiveIndentation' => false,
						'indentation'                => false,
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
			'occurrencesHighlight'       => 'multiFile',
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

	/**
	 * Store editor options as older versions did, without the sanitize callback
	 * that migrates them on save.
	 */
	private function update_legacy_editor_options( $editor_options ) {
		remove_all_filters( 'sanitize_option_' . Option::OPTION_NAMES['editor_options'] );
		update_option( Option::OPTION_NAMES['editor_options'], $editor_options );
	}

	public function test_maybe_upgrade_migrates_legacy_editor_options() {
		// `hover` was persisted as a boolean by older versions.
		$this->update_legacy_editor_options(
			array(
				'hover'              => false,
				'renderIndentGuides' => false,
				'unknownOption'      => true,
			)
		);
		delete_option( Option::OPTION_NAMES['version'] );

		Settings::maybe_upgrade();

		$stored = get_option( Option::OPTION_NAMES['editor_options'] );
		$this->assertSame( array( 'enabled' => 'off' ), $stored['hover'] );
		$this->assertFalse( $stored['guides']['indentation'] );
		$this->assertArrayNotHasKey( 'renderIndentGuides', $stored );
		$this->assertArrayNotHasKey( 'unknownOption', $stored );
		$this->assertSame( CHBE_VERSION, get_option( Option::OPTION_NAMES['version'] ) );

		// Legacy scalar values of object options receive their nested defaults.
		$expected = array_merge(
			wp_list_pluck( Settings::DEFAULT_EDITOR_OPTIONS['hover']['items'], 'default' ),
			array( 'enabled' => 'off' )
		);
		$this->assertSame( $expected, Settings::get_editor_options()['hover'] );
	}

	public function test_maybe_upgrade_skips_current_version() {
		$this->update_legacy_editor_options( array( 'hover' => false ) );
		update_option( Option::OPTION_NAMES['version'], CHBE_VERSION );

		Settings::maybe_upgrade();

		$this->assertSame( array( 'hover' => false ), get_option( Option::OPTION_NAMES['editor_options'] ) );
	}

	public function test_maybe_upgrade_does_not_save_defaults() {
		delete_option( Option::OPTION_NAMES['editor_options'] );
		delete_option( Option::OPTION_NAMES['version'] );

		Settings::maybe_upgrade();

		$this->assertFalse( get_option( Option::OPTION_NAMES['editor_options'], false ) );
		$this->assertSame( CHBE_VERSION, get_option( Option::OPTION_NAMES['version'] ) );
	}

	public function test_get_schema() {
		$schema = Settings::get_schema(
			array(
				'scalar' => array(
					'type'    => 'string',
					'default' => 'foo',
				),
				'object' => array(
					'type'  => 'object',
					'items' => array(
						'enabled' => array(
							'type'    => 'boolean',
							'default' => true,
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
					),
					'object' => array(
						'type'       => 'object',
						'properties' => array(
							'enabled' => array(
								'type' => 'boolean',
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
