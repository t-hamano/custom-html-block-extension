<?php
/**
 * Print the plugin's default editor settings and options as JSON.
 *
 * Usage: php defaults.php <plugin root>
 */

define( 'CHBE_URL', '' );

function apply_filters( $hook_name, $value ) {
	return $value;
}

require $argv[1] . '/classes/class-settings.php';

use Custom_Html_Block_Extension\Settings;

$options  = Settings::get_defaults( Settings::DEFAULT_EDITOR_OPTIONS );
$settings = Settings::get_defaults( Settings::DEFAULT_EDITOR_SETTINGS );

echo json_encode(
	array(
		'options'  => $options,
		'settings' => $settings,
	)
);
