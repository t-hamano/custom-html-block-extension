<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

defined( 'ABSPATH' ) || exit;

class Block_Editor {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Abort the process if the editor isn't allowed to use this extension.
		$options = Settings::get_options();
		if ( ! $options['permissionBlockEditor'] ) {
			return;
		}

		// Enqueue block editor scripts
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_scripts' ) );

		// Enqueue block editor styles
		if ( is_admin() ) {
			add_action( 'enqueue_block_assets', array( $this, 'enqueue_editor_styles' ) );
		}
	}

	/**
	 * Enqueue block editor scripts
	 */
	public function enqueue_editor_scripts() {
		$block_editor_asset_file = include CUSTOM_HTML_BLOCK_EXTENSION_PATH . '/build/block-editor.asset.php';

		// Abort the process if the user role isn't allowed to use this extension.
		if ( ! Settings::is_allowed_user() ) {
			return;
		}

		wp_enqueue_script(
			CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE,
			CUSTOM_HTML_BLOCK_EXTENSION_URL . '/build/block-editor.js',
			$block_editor_asset_file['dependencies'],
			$block_editor_asset_file['version'],
			array( 'in_footer' => false )
		);

		Assets::add_script_data( CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE, Assets::get_script_data() );

		wp_set_script_translations( CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE, CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE );

		// The widgets editor and the customizer have no code editor. Loading the script
		// there would also load `wp-editor`, which core doesn't allow with them.
		if ( wp_script_is( 'wp-edit-widgets' ) || wp_script_is( 'wp-customize-widgets' ) ) {
			return;
		}

		$text_editor_asset_file = include CUSTOM_HTML_BLOCK_EXTENSION_PATH . '/build/text-editor.asset.php';

		wp_enqueue_script(
			CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-text-editor',
			CUSTOM_HTML_BLOCK_EXTENSION_URL . '/build/text-editor.js',
			// Depend on the block editor script, which passes `chbeObj`.
			array_merge( $text_editor_asset_file['dependencies'], array( CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE ) ),
			$text_editor_asset_file['version'],
			array( 'in_footer' => false )
		);

		wp_set_script_translations( CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-text-editor', CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE );
	}

	/**
	 * Enqueue block editor styles
	 */
	public function enqueue_editor_styles() {
		$asset_file = include CUSTOM_HTML_BLOCK_EXTENSION_PATH . '/build/block-editor.asset.php';

		// Abort the process if the user role permission is disabled.
		if ( ! Settings::is_allowed_user() ) {
			return;
		}

		wp_enqueue_style(
			CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE,
			CUSTOM_HTML_BLOCK_EXTENSION_URL . '/build/style-block-editor.css',
			array(),
			$asset_file['version']
		);

		Assets::enqueue_font_stylesheet();
	}
}

new Block_Editor();
