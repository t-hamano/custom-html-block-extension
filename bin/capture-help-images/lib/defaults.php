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

$options = array();
foreach ( Settings::DEFAULT_EDITOR_OPTIONS as $key => $value ) {
	if ( 'object' === $value['type'] ) {
		foreach ( $value['items'] as $sub_key => $sub_value ) {
			$options[ $key ][ $sub_key ] = $sub_value['default'];
		}
	} else {
		$options[ $key ] = $value['default'];
	}
}

$settings = array();
foreach ( Settings::DEFAULT_EDITOR_SETTINGS as $key => $value ) {
	$settings[ $key ] = $value['default'];
}

echo json_encode(
	array(
		'options'  => $options,
		'settings' => $settings,
	)
);
