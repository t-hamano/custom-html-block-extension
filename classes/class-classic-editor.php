<?php
/**
 * @package Custom_Html_Block_Extension
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Custom_Html_Block_Extension;

class ClassicEditor {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Abort the process if the editor isn't allowed to use this extenson.
		$options = Settings::get_options();
		if ( ! $options['permissionClassicEditor'] ) {
			return;
		}

		// Enqueue classic editor scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		// Add custom button
		add_action( 'media_buttons', array( $this, 'media_buttons' ) );
		// Add dialog
		add_action( 'admin_footer-post.php', array( $this, 'admin_footer' ) );
		add_action( 'admin_footer-post-new.php', array( $this, 'admin_footer' ) );
	}

	/**
	 * Enqueue classic editor scripts
	 */
	public function admin_enqueue_scripts( $hook_suffix ) {
		// Abort the process if post/page editor is not displayed.
		if ( 'post.php' !== $hook_suffix && 'post-new.php' !== $hook_suffix ) {
			return;
		}

		// Abort the process if the editor is not supported.
		if ( ! post_type_supports( get_post_type(), 'editor' ) ) {
			return;
		}

		// Abort the process if the block editor is enabled.
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}
		if ( get_current_screen()->is_block_editor ) {
			return;
		}

		// Abort the process if the user role isn't allowed to use this extension.
		if ( ! Settings::is_allowed_user() ) {
			return;
		}

		wp_enqueue_style(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/style-classic-editor.css',
			array(),
			filemtime( CHBE_PATH . '/build/style-classic-editor.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-font',
			CHBE_URL . '/assets/css/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/assets/css/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE . '-tools',
			CHBE_URL . '/assets/js/classic-editor-tools.js',
			array( 'jquery-ui-dialog' ),
			filemtime( CHBE_PATH . '/assets/js/classic-editor-tools.js' ),
			true
		);

		wp_enqueue_script(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/classic-editor.js',
			array( 'wp-backbone' ),
			filemtime( CHBE_PATH . '/build/classic-editor.js' ),
			true
		);

		wp_localize_script(
			CHBE_NAMESPACE,
			'chbeObj',
			array(
				'pluginUrl'      => CHBE_URL,
				'editorSettings' => Settings::get_editor_settings(),
				'editorOptions'  => Settings::get_editor_options(),
				'fontFamily'     => Settings::get_font_families(),
			)
		);
	}

	/**
	 * Add custom button
	 */
	public function media_buttons( $editor_id ) {
		// Abort the process if this is not the main editor.
		if ( 'content' !== $editor_id ) {
			return;
		}

		// Abort the process if the editor is not supported.
		if ( ! post_type_supports( get_post_type(), 'editor' ) ) {
			return;
		}

		// Abort the process if the user role isn't allowed to use this extension.
		if ( ! Settings::is_allowed_user() ) {
			return;
		}

		printf(
			'<button type="button" class="button chbe-replace-indent" id="chbe-replace-indent-button">' . Settings::ICON . ' %s' . '</button>',
			__( 'Change Indentation', 'custom-html-block-extension' )
		);
	}

	/**
	 * Add dialog
	 */
	public function admin_footer() {
		// Abort the process if the block editor is enabled.
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}
		if ( get_current_screen()->is_block_editor ) {
			return;
		}

		// Abort the process if the editor is not supported.
		if ( ! post_type_supports( get_post_type(), 'editor' ) ) {
			return;
		}

		// Abort the process if the user role isn't allowed to use this extension.
		if ( ! Settings::is_allowed_user() ) {
			return;
		}

		$settings = Settings::get_editor_settings();
		// phpcs:disable Generic.ControlStructures.InlineControlStructure
		?>
		<div id="chbe-replace-indent-dialog" class="chbe-dialog__inner">
			<h2 class="chbe-dialog__title"><?php echo esc_attr_e( 'Change Indentation', 'custom-html-block-extension' ); ?></h2>
			<div class="chbe-dialog__row">
				<div class="chbe-dialog__setting">
					<h3 class="chbe-dialog__subtitle"><?php esc_html_e( 'Current Indent', 'custom-html-block-extension' ); ?></h3>
					<fieldset>
						<legend><?php esc_html_e( 'Current indent type', 'custom-html-block-extension' ); ?></legend>
						<label>
							<?php esc_html_e( 'Space', 'custom-html-block-extension' ); ?>
							<input type="radio" name="before_insert_spaces" value="1" <?php checked( $settings['insertSpaces'] ); ?>>
						</label>
						<label>
							<?php esc_html_e( 'Tab', 'custom-html-block-extension' ); ?>
							<input type="radio" name="before_insert_spaces" value="0" <?php checked( ! $settings['insertSpaces'] ); ?>>
						</label>
					</fieldset>
					<p id="chbe-item-before-tab-size" style="<?php if ( ! $settings['insertSpaces'] ) echo 'display:none;'; ?>">
						<label for="chbe_before_tab_size"><strong><?php esc_html_e( 'Current indent width', 'custom-html-block-extension' ); ?></strong></label>
						<input type="number" id="chbe_before_tab_size" name="before_tab_size" min="1" max="8" value="<?php echo esc_attr( $settings['tabSize'] ); ?>">
					</p>
				</div>
				<span class="chbe-dialog__arrow dashicons dashicons-arrow-right-alt"></span>
				<div class="chbe-dialog__setting">
					<h3 class="chbe-dialog__subtitle"><?php esc_html_e( 'New Indent', 'custom-html-block-extension' ); ?></h3>
					<fieldset>
						<legend><?php esc_html_e( 'New indent type', 'custom-html-block-extension' ); ?></legend>
						<label>
							<?php esc_html_e( 'Space', 'custom-html-block-extension' ); ?>
							<input type="radio" name="after_insert_spaces" value="1" <?php checked( $settings['insertSpaces'] ); ?>>
						</label>
						<label>
							<?php esc_html_e( 'Tab', 'custom-html-block-extension' ); ?>
							<input type="radio" name="after_insert_spaces" value="0" <?php checked( ! $settings['insertSpaces'] ); ?>>
						</label>
					</fieldset>
					<p id="chbe-item-after-tab-size" style="<?php if ( ! $settings['insertSpaces'] ) echo 'display:none;'; ?>">
						<label for="chbe_after_tab_size"><strong><?php esc_html_e( 'New indent width', 'custom-html-block-extension' ); ?></strong></label>
						<input type="number" id="chbe_after_tab_size" name="after_tab_size" min="1" max="8" value="<?php echo esc_attr( $settings['tabSize'] ); ?>">
					</p>
				</div>
			</div>
			<div class="chbe-dialog__buttons">
				<button type="button" id="chbe-apply-button" class="button button-primary"><?php echo esc_html_e( 'Apply', 'custom-html-block-extension' ); ?></button>
				<button type="button" id="chbe-cancel-button" class="button button-secondary"><?php echo esc_html_e( 'Cancel', 'custom-html-block-extension' ); ?></button>
			</div>
		</div>
		<?php
	}
}

new ClassicEditor();
