<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

require_once __DIR__ . '/classes/class-option.php';

// This file is loaded inside uninstall_plugin(), so the variable is not global.
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
foreach ( Custom_Html_Block_Extension\Option::OPTION_NAMES as $option_name ) {
	delete_option( $option_name );
}
