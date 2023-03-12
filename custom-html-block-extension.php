<?php
/**
 * Plugin Name: Custom HTML Block Extension
 * Description: Extend custom HTML blocks to evolve into an advanced code editor.
 * Requires at least: 5.9
 * Requires PHP: 7.3
 * Version: 3.2.1
 * Author: Aki Hamano
 * Author URI: https://github.com/t-hamano
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: custom-html-block-extension
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

defined( 'ABSPATH' ) || exit;

$chbe_data = get_file_data(
	__FILE__,
	array(
		'Version'    => 'Version',
		'TextDomain' => 'Text Domain',
	)
);

define( 'CHBE_VERSION', $chbe_data['Version'] );
define( 'CHBE_NAMESPACE', $chbe_data['TextDomain'] );
define( 'CHBE_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'CHBE_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'CHBE_BASENAME', plugin_basename( __FILE__ ) );

require_once __DIR__ . '/classes/class-init.php';
new Custom_Html_Block_Extension\Init();
