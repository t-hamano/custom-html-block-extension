<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

class Assets {

	/**
	 * Get the data shared by the editor scripts as `chbeObj`.
	 */
	public static function get_script_data() {
		return array(
			'pluginUrl'      => CHBE_URL,
			'editorSettings' => Settings::get_editor_settings(),
			'editorOptions'  => Settings::get_editor_options(),
			'fontFamily'     => Settings::get_font_families(),
		);
	}

	/**
	 * Pass data to a script as the global `chbeObj` variable.
	 *
	 * @param string $handle Script handle.
	 * @param array  $data   Data to pass.
	 */
	public static function add_script_data( $handle, array $data ) {
		wp_add_inline_script(
			$handle,
			'var chbeObj = ' . wp_json_encode( $data, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES ) . ';',
			'before'
		);
	}

	/**
	 * Enqueue the font stylesheet used by the editors.
	 */
	public static function enqueue_font_stylesheet() {
		wp_enqueue_style(
			CHBE_NAMESPACE . '-font',
			CHBE_URL . '/assets/css/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/assets/css/fira-code.css' )
		);
	}
}
