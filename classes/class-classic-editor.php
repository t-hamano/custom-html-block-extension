<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

class ClassicEditor {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Abort the process if the editor isn't allowed to use this extenson.
		$options = Settings::get_options();
		if ( ! $options['permissionClassicEditor'] ) {
			return;
		}

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

		// Abort the process if the editor is not supported.
		if ( ! post_type_supports( get_post_type(), 'editor' ) ) {
			return;
		}

		// Abort the process if the block editor is enabled.
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}
		if ( get_current_screen()->is_block_editor ) {
			return;
		}

		// Abort the process if the user role isn't allowed to use this extension.
		if ( ! Settings::is_allowed_user() ) {
			return;
		}

		wp_enqueue_style(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/style-classic-editor.css',
			array(),
			filemtime( CHBE_PATH . '/build/style-classic-editor.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-font',
			CHBE_URL . '/assets/css/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/assets/css/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE . '-tools',
			CHBE_URL . '/assets/js/classic-editor-tools.js',
			array( 'jquery-ui-dialog' ),
			filemtime( CHBE_PATH . '/assets/js/classic-editor-tools.js' ),
			true
		);

		wp_enqueue_script(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/classic-editor.js',
			array( 'wp-backbone' ),
			filemtime( CHBE_PATH . '/build/classic-editor.js' ),
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
			)
		);
	}
}

new ClassicEditor();
