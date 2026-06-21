<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

class Init {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Load translated strings
		load_plugin_textdomain( CHBE_NAMESPACE );

		// Add a link to this plugin settings page in plugin list
		add_filter( 'plugin_action_links_' . CHBE_BASENAME, array( $this, 'add_action_links' ) );

		// Load classes
		$this->load_classes();
	}

	/**
	 * Add a link to this plugin settings page in plugin list
	 */
	public function add_action_links( $links ) {
		$link = '<a href="' . admin_url( 'options-general.php?page=' . CHBE_NAMESPACE ) . '">' . __( 'Settings', 'custom-html-block-extension' ) . '</a>';
		array_unshift( $links, $link );
		return $links;
	}

	/**
	 * Load classes
	 */
	public function load_classes() {
		require_once CHBE_PATH . '/classes/class-option.php';
		require_once CHBE_PATH . '/classes/class-settings.php';
		require_once CHBE_PATH . '/classes/class-admin.php';
		require_once CHBE_PATH . '/classes/class-block-editor.php';
		require_once CHBE_PATH . '/classes/class-classic-editor.php';
		require_once CHBE_PATH . '/classes/class-theme-plugin-editor.php';
		require_once CHBE_PATH . '/classes/class-api.php';
	}
}
