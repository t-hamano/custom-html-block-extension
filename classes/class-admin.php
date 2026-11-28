<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

defined( 'ABSPATH' ) || exit;

class Admin {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Add admin page
		add_action( 'admin_menu', array( $this, 'add_admin_page' ) );
		// Enqueue admin scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		// Register settings
		add_action( 'init', array( $this, 'register_settings' ) );
	}

	/**
	 * Add admin page
	 */
	public function add_admin_page() {
		add_options_page(
			__( 'Custom HTML Block Extension', 'custom-html-block-extension' ),
			__( 'Custom HTML Block Extension', 'custom-html-block-extension' ),
			'manage_options',
			CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE,
			array( $this, 'create_admin_page' )
		);
	}

	/**
	 * Enqueue admin scripts
	 */
	public function admin_enqueue_scripts( $hook_suffix ) {
		// Enqueue pointer.
		$pointer      = CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-pointer';
		$dismissed    = array_filter( explode( ',', (string) get_user_meta( get_current_user_id(), 'dismissed_wp_pointers', true ) ) );
		$is_dismissed = in_array( $pointer, $dismissed, true );

		// Dismiss the pointer once the user visits the settings page.
		if ( ! $is_dismissed && 'settings_page_' . CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE === $hook_suffix ) {
			$dismissed[] = $pointer;
			update_user_meta( get_current_user_id(), 'dismissed_wp_pointers', implode( ',', $dismissed ) );
			$is_dismissed = true;
		}

		if ( current_user_can( 'manage_options' ) && ! $is_dismissed ) {
			$content  = '<h3>' . __( 'Custom HTML Block Extension', 'custom-html-block-extension' ) . '</h3>';
			$content .= '<p>';
			$content .= sprintf(
				/* translators: %s is replaced with the setting page url. */
				__(
					'Custom HTML Block Extension enabled. You can customize the editor in <a href="%s">setting page</a>.',
					'custom-html-block-extension'
				),
				admin_url( 'options-general.php?page=' . CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE )
			);
			$content .= '</p>';

			wp_enqueue_style( 'wp-pointer' );
			wp_enqueue_script( 'wp-pointer' );

			wp_enqueue_script(
				CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-pointer',
				CUSTOM_HTML_BLOCK_EXTENSION_URL . '/assets/js/pointer.js',
				array( 'wp-pointer' ),
				CUSTOM_HTML_BLOCK_EXTENSION_VERSION,
				true
			);

			wp_localize_script(
				CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-pointer',
				'chbePointer',
				array(
					'content' => $content,
					'name'    => $pointer,
				)
			);
		}

		if ( 'settings_page_' . CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE !== $hook_suffix ) {
			return;
		}

		// Enqueue option page scripts.
		$asset_file = include CUSTOM_HTML_BLOCK_EXTENSION_PATH . '/build/admin.asset.php';

		wp_enqueue_style(
			CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-admin',
			CUSTOM_HTML_BLOCK_EXTENSION_URL . '/build/style-admin.css',
			array( 'wp-components' ),
			$asset_file['version']
		);

		wp_enqueue_script(
			CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-admin',
			CUSTOM_HTML_BLOCK_EXTENSION_URL . '/build/admin.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		// Enqueue option page scripts (related to constants)
		Assets::enqueue_font_stylesheet();
		Assets::add_script_data(
			CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-admin',
			array_merge(
				Assets::get_script_data(),
				array(
					'version'   => CUSTOM_HTML_BLOCK_EXTENSION_VERSION,
					'options'   => Settings::get_options(),
					'userRoles' => Settings::get_user_roles(),
				)
			)
		);

		wp_set_script_translations( CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE . '-admin', CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE );
	}

	/**
	 * Register settings
	 */
	public function register_settings() {
		// Register editor settings.
		$default_editor_settings = Settings::get_defaults( Settings::DEFAULT_EDITOR_SETTINGS );

		$args_editor_settings = array(
			'type'         => 'object',
			'description'  => __( 'Editor settings.', 'custom-html-block-extension' ),
			'show_in_rest' => array(
				'schema' => Settings::get_schema( Settings::DEFAULT_EDITOR_SETTINGS ),
			),
			'default'      => $default_editor_settings,
		);

		register_setting( CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE, Option::OPTION_NAMES['editor_settings'], $args_editor_settings );

		// Register editor options.
		$default_editor_options = Settings::get_defaults( Settings::DEFAULT_EDITOR_OPTIONS );

		$args_editor_options = array(
			'type'         => 'object',
			'description'  => __( 'Editor settings.', 'custom-html-block-extension' ),
			'show_in_rest' => array(
				'schema' => Settings::get_schema( Settings::DEFAULT_EDITOR_OPTIONS ),
			),
			'default'      => $default_editor_options,
		);

		register_setting( CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE, Option::OPTION_NAMES['editor_options'], $args_editor_options );

		// Register options.
		$default_options = Settings::get_defaults( Settings::DEFAULT_OPTIONS );

		$args_options = array(
			'type'         => 'object',
			'description'  => __( 'Editor settings.', 'custom-html-block-extension' ),
			'show_in_rest' => array(
				'schema' => Settings::get_schema( Settings::DEFAULT_OPTIONS ),
			),
			'default'      => $default_options,
		);

		register_setting( CUSTOM_HTML_BLOCK_EXTENSION_NAMESPACE, Option::OPTION_NAMES['options'], $args_options );
	}

	/**
	 * Create admin page
	 */
	public function create_admin_page() {
		echo '<div id="custom-html-block-extension-admin"></div>';
	}
}

new Admin();
