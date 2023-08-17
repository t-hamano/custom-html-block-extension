<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

class ThemePluginEditor {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Abort the process if the editor isn't allowed to use this extenson.
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

		// Abort the process if the user role isn't allowed to use this extension.
		if ( ! Settings::is_allowed_user() ) {
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
			CHBE_URL . '/build/style-theme-plugin-editor.css',
			array(),
			filemtime( CHBE_PATH . '/build/style-theme-plugin-editor.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-font',
			CHBE_URL . '/assets/css/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/assets/css/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/theme-plugin-editor.js',
			array(),
			filemtime( CHBE_PATH . '/build/theme-plugin-editor.js' ),
			true
		);

		wp_localize_script(
			CHBE_NAMESPACE,
			'chbeObj',
			array(
				'pluginUrl'      => CHBE_URL,
				'editorSettings' => Settings::get_editor_settings(),
				'editorOptions'  => Settings::get_editor_options(),
				'fontFamily'     => Settings::get_font_families(),
				'language'       => $language,
			)
		);
	}
}

new ThemePluginEditor();
