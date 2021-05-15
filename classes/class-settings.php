<?php
/**
 * @package custom-html-block-extension
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace custom_html_block_extension;

class Settings {

	// Names of the option to update.
	const OPTION_NAME = array(
		'editor_settings'       => 'custom_html_block_extension_editor_settings',
		'editor_options'        => 'custom_html_block_extension_editor_options',
		'dismiss_welcome_guide' => 'custom_html_block_extension_dismiss_welcome_guilde',
	);

	// Default editor settings.
	const DEFAULT_EDITOR_SETTINGS = array(
		'theme'        => array(
			'type'    => 'string',
			'default' => 'vs-dark',
		),
		'insertSpaces' => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'tabSize'      => array(
			'type'    => 'number',
			'default' => 2,
		),
		'emmet'        => array(
			'type'    => 'boolean',
			'default' => true,
		),
	);

	// Default editor options.
	const DEFAULT_EDITOR_OPTIONS = array(
		'acceptSuggestionOnEnter'          => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'autoClosingBrackets'              => array(
			'type'    => 'string',
			'default' => 'always',
		),
		'autoClosingQuotes'                => array(
			'type'    => 'string',
			'default' => 'always',
		),
		'autoIndent'                       => array(
			'type'    => 'string',
			'default' => 'advanced',
		),
		'autoSurround'                     => array(
			'type'    => 'string',
			'default' => 'languageDefined',
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
			'default' => 'blink',
		),
		'cursorSmoothCaretAnimation'       => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'cursorStyle'                      => array(
			'type'    => 'string',
			'default' => 'line',
		),
		'cursorSurroundingLines'           => array(
			'type'    => 'number',
			'default' => 0,
		),
		'cursorSurroundingLinesStyle'      => array(
			'type'    => 'string',
			'default' => 'default',
		),
		'cursorWidth'                      => array(
			'type'    => 'number',
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
					'type'    => 'boolean',
					'default' => true,
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
		'hideCursorInOverviewRuler'        => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'highlightActiveIndentGuide'       => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'hover'                            => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'letterSpacing'                    => array(
			'type'    => 'number',
			'default' => 0,
		),
		'lineDecorationsWidth'             => array(
			'type'    => 'number',
			'default' => 0,
		),
		'lineHeight'                       => array(
			'type'    => 'number',
			'default' => 21,
		),
		'lineNumbers'                      => array(
			'type'    => 'string',
			'default' => 'on',
		),
		'lineNumbersMinChars'              => array(
			'type'    => 'number',
			'default' => 5,
		),
		'links'                            => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'matchBrackets'                    => array(
			'type'    => 'string',
			'default' => 'always',
		),
		'minimap'                          => array(
			'type'  => 'object',
			'items' => array(
				'enabled'          => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'maxColumn'        => array(
					'type'    => 'number',
					'default' => 60,
				),
				'renderCharacters' => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'scale'            => array(
					'type'    => 'number',
					'default' => 1,
				),
				'showSlider'       => array(
					'type'    => 'string',
					'default' => 'mouseover',
				),
				'side'             => array(
					'type'    => 'string',
					'default' => 'right',
				),
				'size'             => array(
					'type'    => 'string',
					'default' => 'proportional',
				),
			),
		),
		'multiCursorModifier'              => array(
			'type'    => 'string',
			'default' => 'alt',
		),
		'multiCursorPaste'                 => array(
			'type'    => 'string',
			'default' => 'spread',
		),
		'mouseWheelScrollSensitivity'      => array(
			'type'    => 'number',
			'default' => 1,
		),
		'mouseWheelZoom'                   => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'occurrencesHighlight'             => array(
			'type'    => 'boolean',
			'default' => true,
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
					'default' => 0,
				),
				'bottom' => array(
					'type'    => 'number',
					'default' => 0,
				),
			),
		),
		'quickSuggestions'                 => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'quickSuggestionsDelay'            => array(
			'type'    => 'number',
			'default' => 10,
		),
		'renderControlCharacters'          => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'renderFinalNewline'               => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'renderIndentGuides'               => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'renderLineHighlight'              => array(
			'type'    => 'string',
			'default' => 'all',
		),
		'renderLineHighlightOnlyWhenFocus' => array(
			'type'    => 'boolean',
			'default' => false,
		),
		'renderWhitespace'                 => array(
			'type'    => 'string',
			'default' => 'none',
		),
		'rulers'                           => array(
			'type'    => 'number',
			'default' => 0,
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
					'default' => 11,
				),
				'horizontal'              => array(
					'type'    => 'string',
					'default' => 'auto',
				),
				'horizontalHasArrows'     => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'horizontalScrollbarSize' => array(
					'type'    => 'number',
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
					'default' => 'auto',
				),
				'verticalHasArrows'       => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'verticalScrollbarSize'   => array(
					'type'    => 'number',
					'default' => 10,
				),
			),
		),
		'scrollBeyondLastColumn'           => array(
			'type'    => 'number',
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
			'default' => 'mouseover',
		),
		'smoothScrolling'                  => array(
			'type'    => 'boolean',
			'default' => false,
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
					'default' => 'replace',
				),
				'showIcons'  => array(
					'type'    => 'boolean',
					'default' => true,
				),
			),
		),
		'suggestFontSize'                  => array(
			'type'    => 'number',
			'default' => 14,
		),
		'suggestLineHeight'                => array(
			'type'    => 'number',
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
		'useTabStops'                      => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'wrappingIndent'                   => array(
			'type'    => 'string',
			'default' => 'none',
		),
		'wordWrap'                         => array(
			'type'    => 'string',
			'default' => 'off',
		),
		'wordWrapColumn'                   => array(
			'type'    => 'number',
			'default' => 80,
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
			'stylesheet' => CHBE_URL . '/build/fonts/source-code-pro.css',
			'weight'     => array( 200, 300, 400, 500, 600, 700, 900 ),
		),
		array(
			'label'      => 'Source Code Pro (Italic)',
			'name'       => 'Source Code Pro Italic',
			'stylesheet' => CHBE_URL . '/build/fonts/source-code-pro-italic.css',
			'weight'     => array( 200, 300, 400, 500, 600, 700, 900 ),
		),
		array(
			'label'      => 'Ubuntu Mono',
			'name'       => 'Ubuntu Mono',
			'stylesheet' => CHBE_URL . '/build/fonts/ubuntu-mono.css',
			'weight'     => array( 300, 700 ),
		),
		array(
			'label'      => 'Ubuntu Mono (Italic)',
			'name'       => 'Ubuntu Mono Italic',
			'stylesheet' => CHBE_URL . '/build/fonts/ubuntu-mono-italic.css',
			'weight'     => array( 300, 700 ),
		),
		array(
			'label'      => 'Anonymous Pro',
			'name'       => 'Anonymous Pro',
			'stylesheet' => CHBE_URL . '/build/fonts/anonymous-pro.css',
			'weight'     => array( 300, 700 ),
		),
		array(
			'label'      => 'Anonymous Pro (Italic)',
			'name'       => 'Anonymous Pro Italic',
			'stylesheet' => CHBE_URL . '/build/fonts/anonymous-pro-italic.css',
			'weight'     => array( 300, 700 ),
		),
	);

	/**
	 * Constructor
	 */
	public function __construct() {
	}

	/**
	 * Get editor config settings.
	 */
	public static function get_editor_settings() {
		// Override default editor settings with option values.
		$default_editor_settings = array();

		foreach ( self::DEFAULT_EDITOR_SETTINGS as $key => $value ) {
			$default_editor_settings[ $key ] = $value['default'];
		}
		$current_editor_settings = get_option( self::OPTION_NAME['editor_settings'] );
		$editor_settings         = array_merge( $default_editor_settings, $current_editor_settings );

		return $editor_settings;
	}

	/**
	 * Get editor config options.
	 */
	public static function get_editor_options() {
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

		return $editor_options;
	}

	/**
	 * Get editor font family variations.
	 */
	public static function get_font_families() {
		$default_font_families    = self::DEFAULT_FONT_FAMILIES;
		$additional_font_families = apply_filters( 'chbe_additional_font_families', array() );
		return array_merge( $default_font_families, $additional_font_families );
	}
}

new Settings();
