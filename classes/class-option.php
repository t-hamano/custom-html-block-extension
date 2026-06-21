<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

class Option {

	// Names of the options this plugin stores.
	// Kept dependency-free so it can be loaded standalone from uninstall.php.
	const OPTION_NAMES = array(
		'editor_settings'       => 'custom_html_block_extension_editor_settings',
		'editor_options'        => 'custom_html_block_extension_editor_options',
		'options'               => 'custom_html_block_extension_options',
		'dismiss_welcome_guide' => 'custom_html_block_extension_dismiss_welcome_guilde',
	);
}
