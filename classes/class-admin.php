<?php
/**
 * @package custom-html-block-extension
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace custom_html_block_extension;

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
			CHBE_NAMESPACE,
			array( $this, 'create_admin_page' )
		);
	}

	/**
	 * Enqueue admin scripts
	 */
	public function admin_enqueue_scripts( $hook_suffix ) {
		// Enqueue pointer.
		$dismissed = explode( ',', get_user_meta( get_current_user_id(), 'dismissed_wp_pointers', true ) );
		if ( false === array_search( CHBE_NAMESPACE . '-pointer', $dismissed, true ) ) {
			$content  = '<h3>' . __( 'Custom HTML Block Extension', 'custom-html-block-extension' ) . '</h3>';
			$content .= '<p>';
			$content .= sprintf(
				/* translators: 1: setting page url */
				__(
					'Custom HTML Block Extension enabled. You can customize the editor in <a href="%s">setting page</a>.',
					'custom-html-block-extension'
				),
				admin_url( 'options-general.php?page=' . CHBE_NAMESPACE )
			);
			$content .= '</p>';

			wp_enqueue_style( 'wp-pointer' );
			wp_enqueue_script( 'wp-pointer' );

			wp_enqueue_script(
				CHBE_NAMESPACE . '-pointer',
				CHBE_URL . '/assets/js/pointer.js',
				array( 'wp-pointer' ),
				filemtime( CHBE_PATH . '/assets/js/pointer.js' ),
				true
			);

			wp_localize_script(
				CHBE_NAMESPACE . '-pointer',
				'chbePointer',
				array(
					'content' => $content,
					'name'    => CHBE_NAMESPACE . '-pointer',
				)
			);
		}

		if ( 'settings_page_' . CHBE_NAMESPACE !== $hook_suffix ) {
			return;
		}

		// Enqueue option page scripts.
		$asset_file = include( CHBE_PATH . '/build/admin/index.asset.php' );

		wp_enqueue_style(
			CHBE_NAMESPACE . '-admin',
			CHBE_URL . '/build/admin/style.css',
			array( 'wp-components' ),
			filemtime( CHBE_PATH . '/build/admin/style.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-admin-font',
			CHBE_URL . '/build/fonts/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/build/fonts/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE . '-admin',
			CHBE_URL . '/build/admin/index.js',
			$asset_file['dependencies'],
			filemtime( CHBE_PATH . '/build/admin/index.js' ),
			true
		);

		// Enqueue option page scripts (related to constants)
		wp_localize_script(
			CHBE_NAMESPACE . '-admin',
			'chbeObj',
			array(
				'assetPath'           => CHBE_URL,
				'version'             => CHBE_VERSION,
				'dismissWelcomeGuide' => get_option( Settings::OPTION_NAME['dismiss_welcome_guide'] ),
				'fontFamily'          => Settings::DEFAULT_FONT_FAMILIES,
			)
		);

		wp_set_script_translations( CHBE_NAMESPACE . '-admin', CHBE_NAMESPACE, CHBE_PATH . '/languages' );
	}

	/**
	 * Register settings
	 */
	public function register_settings() {
		$properties_settings = array();
		$default_settings    = array();

		foreach ( Settings::DEFAULT_EDITOR_SETTINGS as $key => $value ) {
			$properties_settings[ $key ] = array(
				'type' => $value['type'],
			);
			$default_settings[ $key ]    = $value['default'];
		}

		$args_settings = array(
			'type'         => 'object',
			'description'  => __( 'Editor settings.', 'custom-html-block-extension' ),
			'show_in_rest' => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => $properties_settings,
				),
			),
			'default'      => $default_settings,
		);

		register_setting( CHBE_NAMESPACE, Settings::OPTION_NAME['editor_settings'], $args_settings );

		$properties_options = array();
		$default_options    = array();

		foreach ( Settings::DEFAULT_EDITOR_OPTIONS as $key => $value ) {
			$properties_options[ $key ] = array(
				'type' => $value['type'],
			);

			if ( $value['type'] === 'object' ) {
				$properties_options[ $key ]['properties'] = array();

				$default_options[ $key ] = array();

				foreach ( $value['items'] as $sub_key => $sub_value ) {
					$properties_options[ $key ]['properties'][ $sub_key ] = array(
						'type' => $sub_value['type'],
					);
					$default_options[ $key ][ $sub_key ]                  = $sub_value['default'];
				}
			} else {
				$default_options[ $key ] = $value['default'];
			}
		}

		$args_options = array(
			'type'         => 'object',
			'description'  => __( 'Editor settings.', 'custom-html-block-extension' ),
			'show_in_rest' => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => $properties_options,
				),
			),
			'default'      => $default_options,
		);

		register_setting( CHBE_NAMESPACE, Settings::OPTION_NAME['editor_options'], $args_options );
	}

	/**
	 * Create admin page
	 */
	public function create_admin_page() {
		echo '<div id="custom-html-block-extension-admin"></div>';
	}
}

new Admin();
