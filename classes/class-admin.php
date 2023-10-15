<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

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
				/* translators: %s is replaced with the setting page url. */
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
		$asset_file = include CHBE_PATH . '/build/admin.asset.php';

		wp_enqueue_style(
			CHBE_NAMESPACE . '-admin',
			CHBE_URL . '/build/style-admin.css',
			array( 'wp-components' ),
			filemtime( CHBE_PATH . '/build/style-admin.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-admin-font',
			CHBE_URL . '/assets/css/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/assets/css/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE . '-admin',
			CHBE_URL . '/build/admin.js',
			$asset_file['dependencies'],
			filemtime( CHBE_PATH . '/build/admin.js' ),
			true
		);

		// Enqueue option page scripts (related to constants)
		wp_localize_script(
			CHBE_NAMESPACE . '-admin',
			'chbeObj',
			array(
				'pluginUrl'           => CHBE_URL,
				'version'             => CHBE_VERSION,
				'editorSettings'      => Settings::get_editor_settings(),
				'editorOptions'       => Settings::get_editor_options(),
				'options'             => Settings::get_options(),
				'userRoles'           => Settings::get_user_roles(),
				'fontFamily'          => Settings::get_font_families(),
				'dismissWelcomeGuide' => get_option( Settings::OPTION_NAME['dismiss_welcome_guide'] ),
			)
		);

		wp_set_script_translations( CHBE_NAMESPACE . '-admin', CHBE_NAMESPACE );
	}

	/**
	 * Register settings
	 */
	public function register_settings() {
		// Register editor settings.
		$properties_editor_settings = array();
		$default_editor_settings    = array();

		foreach ( Settings::DEFAULT_EDITOR_SETTINGS as $key => $value ) {
			$properties_editor_settings[ $key ] = array(
				'type' => $value['type'],
			);
			$default_editor_settings[ $key ]    = $value['default'];
		}

		$args_editor_settings = array(
			'type'         => 'object',
			'description'  => __( 'Editor settings.', 'custom-html-block-extension' ),
			'show_in_rest' => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => $properties_editor_settings,
				),
			),
			'default'      => $default_editor_settings,
		);

		register_setting( CHBE_NAMESPACE, Settings::OPTION_NAME['editor_settings'], $args_editor_settings );

		// Register editor options.
		$properties_editor_options = array();
		$default_editor_options    = array();

		foreach ( Settings::DEFAULT_EDITOR_OPTIONS as $key => $value ) {
			$properties_editor_options[ $key ] = array(
				'type' => $value['type'],
			);

			if ( $value['type'] === 'object' ) {
				$properties_editor_options[ $key ]['properties'] = array();

				$default_editor_options[ $key ] = array();

				foreach ( $value['items'] as $sub_key => $sub_value ) {
					$properties_editor_options[ $key ]['properties'][ $sub_key ] = array(
						'type' => $sub_value['type'],
					);
					$default_editor_options[ $key ][ $sub_key ]                  = $sub_value['default'];
				}
			} else {
				$default_editor_options[ $key ] = $value['default'];
			}
		}

		$args_editor_options = array(
			'type'         => 'object',
			'description'  => __( 'Editor settings.', 'custom-html-block-extension' ),
			'show_in_rest' => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => $properties_editor_options,
				),
			),
			'default'      => $default_editor_options,
		);

		register_setting( CHBE_NAMESPACE, Settings::OPTION_NAME['editor_options'], $args_editor_options );

		// Register options.
		$properties_options = array();
		$default_options    = array();

		foreach ( Settings::DEFAULT_OPTIONS as $key => $value ) {
			$properties_options[ $key ] = array(
				'type' => $value['type'],
			);
			$default_options[ $key ]    = $value['default'];
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

		register_setting( CHBE_NAMESPACE, Settings::OPTION_NAME['options'], $args_options );
	}

	/**
	 * Create admin page
	 */
	public function create_admin_page() {
		echo '<div id="custom-html-block-extension-admin"></div>';
	}
}

new Admin();
