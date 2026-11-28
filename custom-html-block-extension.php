<?php
/**
 * Plugin Name: Custom HTML Block Extension
 * Description: Turn the Custom HTML block into an advanced code editor.
 * Requires at least: 7.1
 * Requires PHP: 8.2
 * Version: 5.0.0
 * Author: Aki Hamano
 * Author URI: https://github.com/t-hamano
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: custom-html-block-extension
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

defined( 'ABSPATH' ) || exit;

$custom_html_block_extension_data = get_file_data(
	__FILE__,
	array(
		'Version'    => 'Version',
		'TextDomain' => 'Text Domain',
	)
);

define( 'CUSTOM_HTML_BLOCK_EXTENSION_VERSION', $custom_html_block_extension_data['Version'] );
define( 'CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE', $custom_html_block_extension_data['TextDomain'] );
define( 'CUSTOM_HTML_BLOCK_EXTENSION_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'CUSTOM_HTML_BLOCK_EXTENSION_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'CUSTOM_HTML_BLOCK_EXTENSION_BASENAME', plugin_basename( __FILE__ ) );

require_once __DIR__ . '/classes/class-init.php';
new Custom_Html_Block_Extension\Init();
