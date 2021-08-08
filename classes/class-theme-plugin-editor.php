<?php
/**
 * @package custom-html-block-extension
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace custom_html_block_extension;

class ThemePluginEditor {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Abort the process if permission is disabled.
		$options = Settings::get_options();
		if ( ! $options['permissionThemePluginEditor'] ) {
			return;
		}

		// Enqueue theme and plugin editor scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Enqueue theme and plugin editor scripts
	 */
	public function admin_enqueue_scripts( $hook_suffix ) {
		// Abort the process if post/page editor is not displayed.
		if ( 'theme-editor.php' !== $hook_suffix && 'plugin-editor.php' !== $hook_suffix ) {
			return;
		}

		// Correspondence between the file extension and the language specified in the Monaco Editor
		$map_to_lang = array(
			'css'  => 'css',
			'htm'  => 'html',
			'html' => 'html',
			'svg'  => 'html',
			'js'   => 'javascript',
			'jsx'  => 'javascript',
			'json' => 'json',
			'less' => 'less',
			'md'   => 'markdown',
			'php'  => 'php',
			'sass' => 'scss',
			'scss' => 'scss',
			'bash' => 'shell',
			'sh'   => 'shell',
			'sql'  => 'sql',
			'xml'  => 'xml',
			'yaml' => 'yaml',
			'yml'  => 'yaml',
		);

		// Set the language name of the monaco editor
		$language = null;

		if ( isset( $_GET['file'] ) ) {
			$ext = pathinfo( $_GET['file'], PATHINFO_EXTENSION );
			if ( isset( $map_to_lang[ $ext ] ) ) {
				$language = $map_to_lang[ $ext ];
			}
		} elseif ( 'theme-editor.php' === $hook_suffix ) {
			$language = 'css';
		} elseif ( 'plugin-editor.php' === $hook_suffix ) {
			$language = 'php';
		}

		// Disable the default code editor (CodeMirror).
		wp_dequeue_script( 'wp-theme-plugin-editor' );
		wp_deregister_style( 'wp-codemirror' );
		wp_deregister_script( 'wp-codemirror' );

		wp_enqueue_style(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/theme-plugin-editor/style.css',
			array(),
			filemtime( CHBE_PATH . '/build/theme-plugin-editor/style.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-font',
			CHBE_URL . '/build/fonts/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/build/fonts/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/theme-plugin-editor/index.js',
			array(),
			filemtime( CHBE_PATH . '/build/theme-plugin-editor/index.js' ),
			true
		);

		wp_localize_script(
			CHBE_NAMESPACE,
			'chbeObj',
			array(
				'editorSettings' => Settings::get_editor_settings(),
				'editorOptions'  => Settings::get_editor_options(),
				'fontFamily'     => Settings::get_font_families(),
				'language'       => $language,
			)
		);
	}
}

new ThemePluginEditor();
