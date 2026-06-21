<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'custom_html_block_extension_editor_settings' );
delete_option( 'custom_html_block_extension_editor_options' );
delete_option( 'custom_html_block_extension_options' );
delete_option( 'custom_html_block_extension_dismiss_welcome_guilde' );
