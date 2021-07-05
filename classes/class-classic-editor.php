<?php
/**
 * @package custom-html-block-extension
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace custom_html_block_extension;

class ClassicEditor {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Enqueue classic editor scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Enqueue classic editor scripts
	 */
	public function admin_enqueue_scripts( $hook_suffix ) {
		// Abort the process if post/page editor is not displayed.
		if ( 'post.php' !== $hook_suffix && 'post-new.php' !== $hook_suffix ) {
			return;
		}

		// Abort the process if block editor is enabled.
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}
		if ( get_current_screen()->is_block_editor ) {
			return;
		}

		// Abort the process if permission is disabled.
		$options = Settings::get_options();

		if ( ! $options['permissionClassicEditor'] ) {
			return;
		}

		wp_enqueue_style(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/classic-editor/style.css',
			array(),
			filemtime( CHBE_PATH . '/build/classic-editor/style.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-font',
			CHBE_URL . '/build/fonts/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/build/fonts/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/classic-editor/index.js',
			array(),
			filemtime( CHBE_PATH . '/build/classic-editor/index.js' ),
			true
		);

		wp_localize_script(
			CHBE_NAMESPACE,
			'chbeObj',
			array(
				'editorSettings' => Settings::get_editor_settings(),
				'editorOptions'  => Settings::get_editor_options(),
				'fontFamily'     => Settings::get_font_families(),
			)
		);
	}
}

new ClassicEditor();
