<?php
/**
 * @package custom-html-block-extension
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace custom_html_block_extension;

class BlockEditor {

	/**
	 * Constructor
	 */
	function __construct() {
		// Enqueue block editor scripts
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_scripts' ) );
	}

	/**
	 * Enqueue block editor scripts
	 */
	public function enqueue_editor_scripts() {
		$asset_file = include( CHBE_PATH . '/build/block-editor/index.asset.php' );

		// Abort the process if permission is disabled.
		$options = Settings::get_options();

		if ( ! $options['permissionBlockEditor'] ) {
			return;
		}

		wp_enqueue_style(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/block-editor/editor.css',
			array(),
			filemtime( CHBE_PATH . '/build/block-editor/editor.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-font',
			CHBE_URL . '/build/fonts/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/build/fonts/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/block-editor/index.js',
			$asset_file['dependencies'],
			filemtime( CHBE_PATH . '/build/block-editor/index.js' )
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

		wp_set_script_translations( CHBE_NAMESPACE, CHBE_NAMESPACE, CHBE_PATH . '/languages' );
	}
}

new BlockEditor();
