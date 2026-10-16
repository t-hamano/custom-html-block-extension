<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

class Settings {

	// Default editor settings.
	const DEFAULT_EDITOR_SETTINGS = array(
		'theme'             => array(
			'type'    => 'string',
			'default' => 'vs-dark',
		),
		'insertSpaces'      => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'tabSize'           => array(
			'type'    => 'number',
			'minimum' => 1,
			'maximum' => 8,
			'default' => 2,
		),
		'detectIndentation' => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'emmet'             => array(
			'type'    => 'boolean',
			'default' => true,
		),
	);

	// Default editor options.
	const DEFAULT_EDITOR_OPTIONS = array(
		'acceptSuggestionOnEnter'          => array(
			'type'    => 'string',
			'enum'    => array( 'on', 'smart', 'off' ),
			'default' => 'on',
		),
		'autoClosingBrackets'              => array(
			'type'    => 'string',
			'enum'    => array( 'always', 'languageDefined', 'beforeWhitespace', 'never' ),
			'default' => 'always',
		),
		'autoClosingDelete'                => array(
			'type'    => 'string',
			'enum'    => array( 'always', 'auto', 'never' ),
			'default' => 'auto',
		),
		'autoClosingOvertype'              => array(
			'type'    => 'string',
			'enum'    => array( 'always', 'auto', 'never' ),
			'default' => 'auto',
		),
		'autoClosingQuotes'                => array(
			'type'    => 'string',
			'enum'    => array( 'always', 'languageDefined', 'beforeWhitespace', 'never' ),
			'default' => 'always',
		),
		'autoIndent'                       => array(
			'type'    => 'string',
			'enum'    => array( 'none', 'keep', 'brackets', 'advanced' ),
			'default' => 'advanced',
		),
		'autoSurround'                     => array(
			'type'    => 'string',
			'enum'    => array( 'languageDefined', 'quotes', 'brackets', 'never' ),
			'default' => 'languageDefined',
		),
		'bracketPairColorization'          => array(
			'type'  => 'object',
			'items' => array(
				'enabled'                            => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'independentColorPoolPerBracketType' => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
		),
		'columnSelection'                  => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'comments'                         => array(
			'type'  => 'object',
			'items' => array(
				'insertSpace' => array(
					'type'    => 'boolean',
					'default' => true,
				),
			),
		),
		'contextmenu'                      => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'copyWithSyntaxHighlighting'       => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'cursorBlinking'                   => array(
			'type'    => 'string',
			'enum'    => array( 'blink', 'smooth', 'phase', 'expand', 'solid' ),
			'default' => 'blink',
		),
		'cursorSmoothCaretAnimation'       => array(
			'type'    => 'string',
			'enum'    => array( 'on', 'explicit', 'off' ),
			'default' => 'off',
		),
		'cursorStyle'                      => array(
			'type'    => 'string',
			'enum'    => array( 'line', 'line-thin', 'block', 'block-outline', 'underline', 'underline-thin' ),
			'default' => 'line',
		),
		'cursorSurroundingLines'           => array(
			'type'    => 'number',
			'minimum' => 0,
			'maximum' => 20,
			'default' => 0,
		),
		'cursorSurroundingLinesStyle'      => array(
			'type'    => 'string',
			'enum'    => array( 'default', 'all' ),
			'default' => 'default',
		),
		'cursorWidth'                      => array(
			'type'    => 'number',
			'minimum' => 2,
			'maximum' => 10,
			'default' => 2,
		),
		'dragAndDrop'                      => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'emptySelectionClipboard'          => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'fastScrollSensitivity'            => array(
			'type'    => 'number',
			'minimum' => 1,
			'maximum' => 10,
			'default' => 5,
		),
		'find'                             => array(
			'type'  => 'object',
			'items' => array(
				'addExtraSpaceOnTop'            => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'loop'                          => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'seedSearchStringFromSelection' => array(
					'type'    => 'string',
					'enum'    => array( 'always', 'selection', 'never' ),
					'default' => 'always',
				),
			),
		),
		'folding'                          => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'foldingHighlight'                 => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'foldingStrategy'                  => array(
			'type'    => 'string',
			'enum'    => array( 'auto', 'indentation' ),
			'default' => 'auto',
		),
		'fontFamily'                       => array(
			'type'    => 'string',
			'default' => 'Fira Code',
		),
		'fontLigatures'                    => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'fontSize'                         => array(
			'type'    => 'number',
			'minimum' => 10,
			'maximum' => 30,
			'default' => 14,
		),
		'fontWeight'                       => array(
			'type'    => 'string',
			'default' => '300',
		),
		'formatOnPaste'                    => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'glyphMargin'                      => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'guides'                           => array(
			'type'  => 'object',
			'items' => array(
				'bracketPairs'               => array(
					'type'    => array( 'boolean', 'string' ),
					'enum'    => array( true, 'active', false ),
					'default' => false,
				),
				'bracketPairsHorizontal'     => array(
					'type'    => array( 'boolean', 'string' ),
					'enum'    => array( true, 'active', false ),
					'default' => 'active',
				),
				'highlightActiveBracketPair' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'highlightActiveIndentation' => array(
					'type'    => array( 'boolean', 'string' ),
					'enum'    => array( true, 'always', false ),
					'default' => true,
				),
				'indentation'                => array(
					'type'    => 'boolean',
					'default' => true,
				),
			),
		),
		'hideCursorInOverviewRuler'        => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'hover'                            => array(
			'type'  => 'object',
			'items' => array(
				'above'   => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'delay'   => array(
					'type'    => 'number',
					'minimum' => 0,
					'maximum' => 3000,
					'default' => 300,
				),
				'enabled' => array(
					'type'    => 'string',
					'enum'    => array( 'on', 'onKeyboardModifier', 'off' ),
					'default' => 'on',
				),
				'sticky'  => array(
					'type'    => 'boolean',
					'default' => true,
				),
			),
		),
		'letterSpacing'                    => array(
			'type'    => 'number',
			'minimum' => -2,
			'maximum' => 2,
			'default' => 0,
		),
		'lineDecorationsWidth'             => array(
			'type'    => 'number',
			'minimum' => 0,
			'maximum' => 30,
			'default' => 0,
		),
		'lineHeight'                       => array(
			'type'    => 'number',
			'minimum' => 10,
			'maximum' => 60,
			'default' => 21,
		),
		'lineNumbers'                      => array(
			'type'    => 'string',
			'enum'    => array( 'off', 'on', 'relative', 'interval' ),
			'default' => 'on',
		),
		'lineNumbersMinChars'              => array(
			'type'    => 'number',
			'minimum' => 1,
			'maximum' => 10,
			'default' => 5,
		),
		'links'                            => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'matchBrackets'                    => array(
			'type'    => 'string',
			'enum'    => array( 'always', 'never', 'near' ),
			'default' => 'always',
		),
		'minimap'                          => array(
			'type'  => 'object',
			'items' => array(
				'autohide'         => array(
					'type'    => 'string',
					'enum'    => array( 'none', 'mouseover', 'scroll' ),
					'default' => 'none',
				),
				'enabled'          => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'maxColumn'        => array(
					'type'    => 'number',
					'minimum' => 10,
					'maximum' => 60,
					'default' => 60,
				),
				'renderCharacters' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'scale'            => array(
					'type'    => 'number',
					'minimum' => 1,
					'maximum' => 3,
					'default' => 1,
				),
				'showSlider'       => array(
					'type'    => 'string',
					'enum'    => array( 'always', 'mouseover' ),
					'default' => 'mouseover',
				),
				'side'             => array(
					'type'    => 'string',
					'enum'    => array( 'left', 'right' ),
					'default' => 'right',
				),
				'size'             => array(
					'type'    => 'string',
					'enum'    => array( 'proportional', 'fill', 'fit' ),
					'default' => 'proportional',
				),
			),
		),
		'multiCursorModifier'              => array(
			'type'    => 'string',
			'enum'    => array( 'alt', 'ctrlCmd' ),
			'default' => 'alt',
		),
		'multiCursorPaste'                 => array(
			'type'    => 'string',
			'enum'    => array( 'spread', 'full' ),
			'default' => 'spread',
		),
		'mouseWheelScrollSensitivity'      => array(
			'type'    => 'number',
			'minimum' => 1,
			'maximum' => 10,
			'default' => 1,
		),
		'mouseWheelZoom'                   => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'occurrencesHighlight'             => array(
			'type'    => 'string',
			'enum'    => array( 'off', 'singleFile' ),
			'default' => 'singleFile',
		),
		'overviewRulerBorder'              => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'padding'                          => array(
			'type'  => 'object',
			'items' => array(
				'top'    => array(
					'type'    => 'number',
					'minimum' => 0,
					'maximum' => 50,
					'default' => 0,
				),
				'bottom' => array(
					'type'    => 'number',
					'minimum' => 0,
					'maximum' => 50,
					'default' => 0,
				),
			),
		),
		'quickSuggestions'                 => array(
			'type'  => 'object',
			'items' => array(
				'other'    => array(
					'type'    => 'string',
					'enum'    => array( 'on', 'inline', 'off' ),
					'default' => 'on',
				),
				'comments' => array(
					'type'    => 'string',
					'enum'    => array( 'on', 'inline', 'off' ),
					'default' => 'on',
				),
				'strings'  => array(
					'type'    => 'string',
					'enum'    => array( 'on', 'inline', 'off' ),
					'default' => 'on',
				),
			),
		),
		'quickSuggestionsDelay'            => array(
			'type'    => 'number',
			'minimum' => 0,
			'maximum' => 1000,
			'default' => 10,
		),
		'renderControlCharacters'          => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'renderFinalNewline'               => array(
			'type'    => 'string',
			'enum'    => array( 'on', 'dimmed', 'off' ),
			'default' => 'on',
		),
		'renderLineHighlight'              => array(
			'type'    => 'string',
			'enum'    => array( 'all', 'line', 'gutter', 'none' ),
			'default' => 'all',
		),
		'renderLineHighlightOnlyWhenFocus' => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'renderWhitespace'                 => array(
			'type'    => 'string',
			'enum'    => array( 'all', 'boundary', 'selection', 'trailing', 'none' ),
			'default' => 'none',
		),
		'rulers'                           => array(
			'type'    => 'array',
			'items'   => array(
				'type'                 => array( 'number', 'object' ),
				'minimum'              => 1,
				'maximum'              => 100,
				'properties'           => array(
					'column' => array(
						'type'     => 'number',
						'minimum'  => 1,
						'maximum'  => 100,
						'required' => true,
					),
					'color'  => array(
						'type'     => 'string',
						'format'   => 'hex-color',
						'required' => true,
					),
				),
				'additionalProperties' => false,
			),
			'default' => array(),
		),
		'roundedSelection'                 => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'scrollbar'                        => array(
			'type'  => 'object',
			'items' => array(
				'alwaysConsumeMouseWheel' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'arrowSize'               => array(
					'type'    => 'number',
					'minimum' => 5,
					'maximum' => 50,
					'default' => 11,
				),
				'horizontal'              => array(
					'type'    => 'string',
					'enum'    => array( 'auto', 'visible', 'hidden' ),
					'default' => 'auto',
				),
				'horizontalHasArrows'     => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'horizontalScrollbarSize' => array(
					'type'    => 'number',
					'minimum' => 5,
					'maximum' => 30,
					'default' => 10,
				),
				'scrollByPage'            => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'useShadows'              => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'vertical'                => array(
					'type'    => 'string',
					'enum'    => array( 'auto', 'visible', 'hidden' ),
					'default' => 'auto',
				),
				'verticalHasArrows'       => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'verticalScrollbarSize'   => array(
					'type'    => 'number',
					'minimum' => 5,
					'maximum' => 30,
					'default' => 10,
				),
			),
		),
		'scrollBeyondLastColumn'           => array(
			'type'    => 'number',
			'minimum' => 0,
			'maximum' => 20,
			'default' => 5,
		),
		'scrollBeyondLastLine'             => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'selectionHighlight'               => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'selectOnLineNumbers'              => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'showFoldingControls'              => array(
			'type'    => 'string',
			'enum'    => array( 'always', 'mouseover', 'never' ),
			'default' => 'mouseover',
		),
		'smoothScrolling'                  => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'stickyScroll'                     => array(
			'type'  => 'object',
			'items' => array(
				'enabled'      => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'maxLineCount' => array(
					'type'    => 'number',
					'minimum' => 1,
					'maximum' => 20,
					'default' => 5,
				),
			),
		),
		'stickyTabStops'                   => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'suggest'                          => array(
			'type'  => 'object',
			'items' => array(
				'insertMode' => array(
					'type'    => 'string',
					'enum'    => array( 'insert', 'replace' ),
					'default' => 'insert',
				),
				'preview'    => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'showIcons'  => array(
					'type'    => 'boolean',
					'default' => true,
				),
			),
		),
		'suggestFontSize'                  => array(
			'type'    => 'number',
			'minimum' => 10,
			'maximum' => 30,
			'default' => 14,
		),
		'suggestLineHeight'                => array(
			'type'    => 'number',
			'minimum' => 10,
			'maximum' => 60,
			'default' => 21,
		),
		'suggestOnTriggerCharacters'       => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'unfoldOnClickAfterEndOfLine'      => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'unicodeHighlight'                 => array(
			'type'  => 'object',
			'items' => array(
				'ambiguousCharacters' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'invisibleCharacters' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'nonBasicASCII'       => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
		),
		'useTabStops'                      => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'wrappingIndent'                   => array(
			'type'    => 'string',
			'enum'    => array( 'none', 'same', 'indent', 'deepIndent' ),
			'default' => 'none',
		),
		'wordWrap'                         => array(
			'type'    => 'string',
			'enum'    => array( 'off', 'on', 'wordWrapColumn', 'bounded' ),
			'default' => 'off',
		),
		'wordWrapColumn'                   => array(
			'type'    => 'number',
			'minimum' => 20,
			'maximum' => 200,
			'default' => 80,
		),
		'wordWrapIndicator'                => array(
			'type'    => 'boolean',
			'default' => false,
		),
	);

	// Default options.
	const DEFAULT_OPTIONS = array(
		'permissionBlockEditor'       => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'permissionClassicEditor'     => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'permissionThemePluginEditor' => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'permissionRoles'             => array(
			'type'    => 'array',
			'items'   => array(
				'type' => 'string',
			),
			'default' => array( 'administrator', 'editor', 'author', 'contributor' ),
		),
	);

	// Default font family variations.
	const DEFAULT_FONT_FAMILIES = array(
		array(
			'label'  => 'Fira Code',
			'name'   => 'Fira Code',
			'weight' => array( 300, 400, 500, 600, 700 ),
		),
		array(
			'label'      => 'Source Code Pro',
			'name'       => 'Source Code Pro',
			'stylesheet' => CHBE_URL . '/assets/css/source-code-pro.css',
			'weight'     => array( 200, 300, 400, 500, 600, 700, 900 ),
		),
		array(
			'label'      => 'Source Code Pro (Italic)',
			'name'       => 'Source Code Pro Italic',
			'stylesheet' => CHBE_URL . '/assets/css/source-code-pro-italic.css',
			'weight'     => array( 200, 300, 400, 500, 600, 700, 900 ),
		),
		array(
			'label'      => 'Ubuntu Mono',
			'name'       => 'Ubuntu Mono',
			'stylesheet' => CHBE_URL . '/assets/css/ubuntu-mono.css',
			'weight'     => array( 300, 700 ),
		),
		array(
			'label'      => 'Ubuntu Mono (Italic)',
			'name'       => 'Ubuntu Mono Italic',
			'stylesheet' => CHBE_URL . '/assets/css/ubuntu-mono-italic.css',
			'weight'     => array( 300, 700 ),
		),
		array(
			'label'      => 'Anonymous Pro',
			'name'       => 'Anonymous Pro',
			'stylesheet' => CHBE_URL . '/assets/css/anonymous-pro.css',
			'weight'     => array( 300, 700 ),
		),
		array(
			'label'      => 'Anonymous Pro (Italic)',
			'name'       => 'Anonymous Pro Italic',
			'stylesheet' => CHBE_URL . '/assets/css/anonymous-pro-italic.css',
			'weight'     => array( 300, 700 ),
		),
	);

	/**
	 * Get default values from a schema.
	 *
	 * Object properties get the defaults of their items.
	 *
	 * @param array $schema Schema such as DEFAULT_EDITOR_SETTINGS.
	 * @return array Default values keyed by property name.
	 */
	public static function get_defaults( array $schema ) {
		$defaults = array();

		foreach ( $schema as $key => $value ) {
			if ( 'object' === $value['type'] ) {
				$defaults[ $key ] = self::get_defaults( $value['items'] );
			} else {
				$defaults[ $key ] = $value['default'];
			}
		}

		return $defaults;
	}

	/**
	 * Get editor config settings.
	 */
	public static function get_editor_settings() {
		// Override default editor settings with option values.
		$default_editor_settings = self::get_defaults( self::DEFAULT_EDITOR_SETTINGS );

		$current_editor_settings = (array) get_option( Option::OPTION_NAMES['editor_settings'] );

		return self::reset_invalid_values(
			self::remove_unknown_properties(
				array_merge( $default_editor_settings, $current_editor_settings ),
				self::DEFAULT_EDITOR_SETTINGS
			),
			self::DEFAULT_EDITOR_SETTINGS
		);
	}

	/**
	 * Get editor config options.
	 *
	 * Overrides the default editor options with the saved values. Object options
	 * are merged one level deeper so that properties added later get their defaults.
	 */
	public static function get_editor_options() {
		$default_editor_options = self::get_defaults( self::DEFAULT_EDITOR_OPTIONS );

		// Migrate before merging so legacy scalar values of object options,
		// such as a boolean `hover`, still receive their nested defaults.
		$current_editor_options = self::migrate_legacy_editor_options(
			(array) get_option( Option::OPTION_NAMES['editor_options'] )
		);

		$editor_options = array_merge( $default_editor_options, $current_editor_options );

		foreach ( self::DEFAULT_EDITOR_OPTIONS as $key => $value ) {
			if ( 'object' === $value['type'] && isset( $current_editor_options[ $key ] ) && is_array( $current_editor_options[ $key ] ) ) {
				$editor_options[ $key ] = array_merge( $default_editor_options[ $key ], $current_editor_options[ $key ] );
			}
		}

		return self::reset_invalid_values(
			self::remove_unknown_properties( $editor_options, self::DEFAULT_EDITOR_OPTIONS ),
			self::DEFAULT_EDITOR_OPTIONS
		);
	}

	/**
	 * Normalize editor options to the current schema: migrate legacy values and
	 * remove unknown properties. Value types are validated by the REST schema.
	 */
	public static function normalize_editor_options( $editor_options ) {
		if ( ! is_array( $editor_options ) ) {
			return $editor_options;
		}

		return self::remove_unknown_properties(
			self::migrate_legacy_editor_options( $editor_options ),
			self::DEFAULT_EDITOR_OPTIONS
		);
	}

	/**
	 * Remove properties that are not in the defaults, such as options removed
	 * in older versions, since the settings schema doesn't allow them.
	 */
	public static function remove_unknown_properties( $values, $defaults ) {
		if ( ! is_array( $values ) ) {
			return $values;
		}

		$values = array_intersect_key( $values, $defaults );

		foreach ( $defaults as $key => $value ) {
			if ( 'object' === $value['type'] && isset( $values[ $key ] ) ) {
				$values[ $key ] = self::remove_unknown_properties( $values[ $key ], $value['items'] );
			}
		}

		return $values;
	}

	/**
	 * Reset values that don't match the schema to their defaults, such as values
	 * saved before an allowed value or range was narrowed. Otherwise the REST API
	 * would return `null` for the whole setting and reject saving it.
	 */
	public static function reset_invalid_values( $values, $defaults ) {
		$schema = self::get_schema( $defaults );

		foreach ( $defaults as $key => $value ) {
			if ( ! array_key_exists( $key, $values ) ) {
				continue;
			}

			if ( 'object' === $value['type'] ) {
				$values[ $key ] = is_array( $values[ $key ] )
					? self::reset_invalid_values( $values[ $key ], $value['items'] )
					: self::get_defaults( $value['items'] );
				continue;
			}

			if ( is_wp_error( rest_validate_value_from_schema( $values[ $key ], $schema['properties'][ $key ], $key ) ) ) {
				$values[ $key ] = $value['default'];
			}
		}

		return $values;
	}

	/**
	 * Normalize editor options persisted by older plugin versions so they match
	 * the current schema.
	 */
	public static function migrate_legacy_editor_options( $editor_options ) {
		// These options were previously persisted as booleans but monaco types
		// them as string enums, so map legacy booleans onto the new values.

		// Changed to `'on' | 'smart' | 'off'` in monaco-editor 0.19.0.
		// Type definitions: https://unpkg.com/monaco-editor@0.19.0/esm/vs/editor/editor.api.d.ts
		if ( isset( $editor_options['acceptSuggestionOnEnter'] ) && is_bool( $editor_options['acceptSuggestionOnEnter'] ) ) {
			$editor_options['acceptSuggestionOnEnter'] = $editor_options['acceptSuggestionOnEnter'] ? 'on' : 'off';
		}

		// Changed to `'off' | 'explicit' | 'on'` in monaco-editor 0.35.0.
		// Upstream change: https://github.com/microsoft/vscode/pull/169113
		// Type definitions: https://unpkg.com/monaco-editor@0.35.0/esm/vs/editor/editor.api.d.ts
		if ( isset( $editor_options['cursorSmoothCaretAnimation'] ) && is_bool( $editor_options['cursorSmoothCaretAnimation'] ) ) {
			$editor_options['cursorSmoothCaretAnimation'] = $editor_options['cursorSmoothCaretAnimation'] ? 'on' : 'off';
		}

		// Changed to `'off' | 'singleFile' | 'multiFile'` in monaco-editor 0.45.0.
		// Upstream change: https://github.com/microsoft/vscode/pull/197690
		// Type definitions: https://unpkg.com/monaco-editor@0.45.0/esm/vs/editor/editor.api.d.ts
		if ( isset( $editor_options['occurrencesHighlight'] ) && is_bool( $editor_options['occurrencesHighlight'] ) ) {
			$editor_options['occurrencesHighlight'] = $editor_options['occurrencesHighlight'] ? 'singleFile' : 'off';
		}

		// 'multiFile' highlights across every editor on the page, which is of little
		// use for separate Custom HTML blocks, so treat it as 'singleFile'. It can
		// come in through the VS Code settings import.
		if ( isset( $editor_options['occurrencesHighlight'] ) && 'multiFile' === $editor_options['occurrencesHighlight'] ) {
			$editor_options['occurrencesHighlight'] = 'singleFile';
		}

		// Changed to `'on' | 'off' | 'dimmed'` in monaco-editor 0.35.0.
		// Upstream change: https://github.com/microsoft/vscode/pull/168220
		// Type definitions: https://unpkg.com/monaco-editor@0.35.0/esm/vs/editor/editor.api.d.ts
		if ( isset( $editor_options['renderFinalNewline'] ) && is_bool( $editor_options['renderFinalNewline'] ) ) {
			$editor_options['renderFinalNewline'] = $editor_options['renderFinalNewline'] ? 'on' : 'off';
		}

		// Changed to `'never' | 'always' | 'selection'` in monaco-editor 0.27.0.
		// Upstream change: https://github.com/microsoft/vscode/pull/128659
		// Type definitions: https://unpkg.com/monaco-editor@0.27.0/esm/vs/editor/editor.api.d.ts
		if (
			isset( $editor_options['find']['seedSearchStringFromSelection'] ) &&
			is_bool( $editor_options['find']['seedSearchStringFromSelection'] )
		) {
			$editor_options['find']['seedSearchStringFromSelection'] =
				$editor_options['find']['seedSearchStringFromSelection'] ? 'always' : 'never';
		}

		// `hover` was previously persisted as a boolean but monaco expects an
		// object, so wrap the legacy boolean into the `enabled` property.
		// Changed to `IEditorHoverOptions` in monaco-editor 0.14.0.
		// Type definitions: https://unpkg.com/monaco-editor@0.14.0/esm/vs/editor/editor.api.d.ts
		if ( isset( $editor_options['hover'] ) && is_bool( $editor_options['hover'] ) ) {
			$editor_options['hover'] = array( 'enabled' => $editor_options['hover'] );
		}

		// `hover.enabled` was previously persisted as a boolean but monaco types
		// it as a string enum, so map legacy booleans onto the new values.
		// Changed to `'on' | 'off' | 'onKeyboardModifier'` in monaco-editor 0.56.0
		// (not mentioned in the CHANGELOG).
		// Upstream change: https://github.com/microsoft/vscode/pull/274001
		// Type definitions: https://unpkg.com/monaco-editor@0.56.0/esm/vs/editor/editor.api.d.ts
		if ( isset( $editor_options['hover']['enabled'] ) && is_bool( $editor_options['hover']['enabled'] ) ) {
			$editor_options['hover']['enabled'] = $editor_options['hover']['enabled'] ? 'on' : 'off';
		}

		// `renderIndentGuides` and `highlightActiveIndentGuide` were replaced by
		// `guides.indentation` and `guides.highlightActiveIndentation`, so move
		// legacy values into `guides`. The legacy value wins over a saved `guides`
		// value.
		// Changed to `IGuidesOptions` in monaco-editor 0.29.0.
		// Upstream change: https://github.com/microsoft/vscode/pull/133509
		// Type definitions: https://unpkg.com/monaco-editor@0.29.0/esm/vs/editor/editor.api.d.ts
		$legacy_guides = array(
			'renderIndentGuides'         => 'indentation',
			'highlightActiveIndentGuide' => 'highlightActiveIndentation',
		);
		foreach ( $legacy_guides as $legacy_key => $key ) {
			if ( array_key_exists( $legacy_key, $editor_options ) ) {
				if ( ! isset( $editor_options['guides'] ) || ! is_array( $editor_options['guides'] ) ) {
					$editor_options['guides'] = wp_list_pluck( self::DEFAULT_EDITOR_OPTIONS['guides']['items'], 'default' );
				}
				$editor_options['guides'][ $key ] = $editor_options[ $legacy_key ];
				unset( $editor_options[ $legacy_key ] );
			}
		}

		// `quickSuggestions` was previously persisted as a boolean but the plugin
		// now stores monaco's per-token-type object, so apply the legacy boolean
		// to every token type, as monaco itself does.
		if ( isset( $editor_options['quickSuggestions'] ) && is_bool( $editor_options['quickSuggestions'] ) ) {
			$value                              = $editor_options['quickSuggestions'] ? 'on' : 'off';
			$editor_options['quickSuggestions'] = array(
				'other'    => $value,
				'comments' => $value,
				'strings'  => $value,
			);
		}

		// `rulers` previously defaulted to `0` but monaco expects an array of
		// columns, so map the legacy default onto an empty array.
		if ( isset( $editor_options['rulers'] ) && 0 === $editor_options['rulers'] ) {
			$editor_options['rulers'] = array();
		}

		return $editor_options;
	}

	/**
	 * Get editor options.
	 */
	public static function get_options() {
		// Override default options with option values.
		$default_options = self::get_defaults( self::DEFAULT_OPTIONS );

		$current_options = (array) get_option( Option::OPTION_NAMES['options'] );

		return array_merge( $default_options, $current_options );
	}

	/**
	 * Build an object schema from the default values.
	 *
	 * Besides the type, the allowed values (`enum`) and ranges (`minimum` and
	 * `maximum`) are kept so that the REST API rejects values the settings UI
	 * can't produce.
	 */
	public static function get_schema( $defaults ) {
		$properties = array();

		foreach ( $defaults as $key => $value ) {
			if ( 'object' === $value['type'] ) {
				$properties[ $key ] = self::get_schema( $value['items'] );
				continue;
			}

			$properties[ $key ] = array(
				'type' => $value['type'],
			);

			foreach ( array( 'items', 'enum', 'minimum', 'maximum' ) as $keyword ) {
				if ( isset( $value[ $keyword ] ) ) {
					$properties[ $key ][ $keyword ] = $value[ $keyword ];
				}
			}
		}

		return array(
			'type'       => 'object',
			'properties' => $properties,
		);
	}

	/**
	 * Get editor font family variations.
	 */
	public static function get_font_families() {
		$additional_font_families = apply_filters( 'chbe_additional_font_families', array() );
		return array_merge( self::DEFAULT_FONT_FAMILIES, $additional_font_families );
	}

	/**
	 * Get all user roles.
	 */
	public static function get_user_roles() {
		$roles            = wp_roles()->get_names();
		$translated_roles = array();

		foreach ( $roles as $name => $display_name ) {
			$translated_roles[] = array(
				'label' => translate_user_role( $display_name ),
				'value' => $name,
			);
		}

		return $translated_roles;
	}

	/**
	 * Whether the user is authorized to use the extension.
	 */
	public static function is_allowed_user() {
		$options   = self::get_options();
		$user_meta = get_userdata( get_current_user_id() );

		if ( ! $user_meta ) {
			return false;
		}

		foreach ( $user_meta->roles as $role ) {
			if ( in_array( $role, $options['permissionRoles'], true ) ) {
				return true;
			}
		}

		return false;
	}
}
