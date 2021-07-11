<?php
/**
 * @package custom-html-block-extension
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace custom_html_block_extension;

class ClassicEditor {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Abort the process if permission is disabled.
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

		// Abort the process if block editor is enabled.
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}
		if ( get_current_screen()->is_block_editor ) {
			return;
		}

		wp_enqueue_style(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/classic-editor/style.css',
			array(),
			filemtime( CHBE_PATH . '/build/classic-editor/style.css' )
		);

		wp_enqueue_style(
			CHBE_NAMESPACE . '-font',
			CHBE_URL . '/build/fonts/fira-code.css',
			array(),
			filemtime( CHBE_PATH . '/build/fonts/fira-code.css' )
		);

		wp_enqueue_script(
			CHBE_NAMESPACE,
			CHBE_URL . '/build/classic-editor/index.js',
			array(),
			filemtime( CHBE_PATH . '/build/classic-editor/index.js' ),
			true
		);

		wp_enqueue_script(
			CHBE_NAMESPACE . '-tools',
			CHBE_URL . '/assets/js/classic-editor-tools.js',
			array( 'jquery-ui-dialog' ),
			filemtime( CHBE_PATH . '/assets/js/classic-editor-tools.js' ),
			true
		);

		wp_localize_script(
			CHBE_NAMESPACE,
			'chbeObj',
			array(
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
		if ( 'content' !== $editor_id ) {
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
		// Abort the process if block editor is enabled.
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}
		if ( get_current_screen()->is_block_editor ) {
			return;
		}

		$settings = Settings::get_editor_settings();
		// phpcs:disable Generic.ControlStructures.InlineControlStructure
		?>
		<div id="chbe-replace-indent-dialog">
			<p class="chbe-dialog__ttl"><?php echo esc_attr_e( 'Change Indentation', 'custom-html-block-extension' ); ?></p>
			<div class="chbe-dialog__row">
				<div class="chbe-dialog__col chbe-dialog__col--setting">
					<p class="chbe-dialog__subttl"><?php esc_html_e( 'Current Indent', 'custom-html-block-extension' ); ?></p>
					<p>
						<strong><?php esc_html_e( 'Indent type', 'custom-html-block-extension' ); ?></strong>
						<label>
							<?php esc_html_e( 'Space', 'custom-html-block-extension' ); ?>
							<input type="radio" name="before_insert_spaces" value="1" <?php if ( $settings['insertSpaces'] ) echo 'checked'; ?>>
						</label>
						<label>
							<?php esc_html_e( 'Tab', 'custom-html-block-extension' ); ?>
							<input type="radio" name="before_insert_spaces" value="0" <?php if ( ! $settings['insertSpaces'] ) echo 'checked'; ?>>
						</label>
					</p>
					<p id="chbe-item-before-tab-size" style="<?php if ( ! $settings['insertSpaces'] ) echo 'display:none;'; ?>">
						<strong><?php esc_html_e( 'Indent width', 'custom-html-block-extension' ); ?></strong>
						<input type="number" name="before_tab_size" min="1" max="8" value="<?php echo esc_attr( $settings['tabSize'] ); ?>">
					</p>
				</div>
				<div class="chbe-dialog__col chbe-dialog__col--arrow">
					<span class="dashicons dashicons-arrow-right-alt">
				</div>
				<div class="chbe-dialog__col chbe-dialog__col--setting">
					<p class="chbe-dialog__subttl"><?php esc_html_e( 'New Indent', 'custom-html-block-extension' ); ?></p>
					<p>
						<strong><?php esc_html_e( 'Indent type', 'custom-html-block-extension' ); ?></strong>
						<label>
							<?php esc_html_e( 'Space', 'custom-html-block-extension' ); ?>
							<input type="radio" name="after_insert_spaces" value="1" <?php if ( $settings['insertSpaces'] ) echo 'checked'; ?>>
						</label>
						<label>
							<?php esc_html_e( 'Tab', 'custom-html-block-extension' ); ?>
							<input type="radio" name="after_insert_spaces" value="0" <?php if ( ! $settings['insertSpaces'] ) echo 'checked'; ?>>
						</label>
					</p>
					<p id="chbe-item-after-tab-size" style="<?php if ( ! $settings['insertSpaces'] ) echo 'display:none;'; ?>">
						<strong><?php esc_html_e( 'Indent width', 'custom-html-block-extension' ); ?></strong>
						<input type="number" name="after_tab_size" min="1" max="8" value="<?php echo esc_attr( $settings['tabSize'] ); ?>">
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
