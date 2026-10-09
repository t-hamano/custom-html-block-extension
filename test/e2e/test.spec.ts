/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Editor', () => {
	test( 'input by Emmet should be expanded on the classic editor', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		// Hide WP pointer.
		await page.addLocatorHandler( page.locator( '#wp-pointer-0' ), async ( wpPointer ) => {
			await wpPointer.locator( 'a.close' ).click();
		} );
		await requestUtils.activatePlugin( 'classic-editor' );
		await admin.visitAdminPage( 'post-new.php' );
		await page.locator( '#content-tmce' ).click();
		await page.locator( '#content-html' ).click();
		await page.locator( '#monaco-editor .monaco-editor' ).click();
		await page.keyboard.type( 'p.selector' );
		await page.keyboard.down( 'Tab' );
		const textarea = page.locator( '#wp-content-editor-container textarea.wp-editor-area' );
		await expect( textarea ).toHaveValue( '<p class="selector"></p>' );
		await requestUtils.deactivatePlugin( 'classic-editor' );
	} );

	test( 'input by Emmet should be expanded on the theme editor', async ( { admin, page } ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php' );
		await page.locator( '#monaco-editor .monaco-editor' ).click();
		// Monaco maps its Ctrl/Cmd modifier from navigator.userAgent, so a
		// "Macintosh" UA (e.g. Playwright's WebKit) needs Meta+A to select all.
		const shortcut = await page.evaluate( () =>
			window.navigator.userAgent.includes( 'Macintosh' ) ? 'Meta+a' : 'Control+a'
		);
		await page.keyboard.press( shortcut );
		await page.keyboard.type( '.selector{fz100', { delay: 50 } );
		await page.keyboard.press( 'Tab' );
		const textarea = page.locator( '#newcontent' );
		await expect( textarea ).toHaveValue( '.selector{font-size: 100px;}' );
	} );

	test( 'JSON schema should be loaded on the theme editor', async ( { admin, page } ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php', 'file=theme.json' );
		await expect( page.locator( '#monaco-editor .monaco-editor' ) ).toBeVisible();

		// `version` must be an integer in the theme.json schema.
		await page.evaluate( () => {
			const model = window.editor?.getModel();
			model?.setValue( model.getValue().replace( /"version":\s*\d+/, '"version": "3"' ) );
		} );

		await expect
			.poll( () =>
				page.evaluate( () =>
					window.monaco?.editor.getModelMarkers( {} ).map( ( { message } ) => message )
				)
			)
			.toContain( 'Incorrect type. Expected "integer".' );
	} );

	test( 'JSON schema should be loaded when `$schema` is changed on the theme editor', async ( {
		admin,
		page,
	} ) => {
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
		await admin.visitAdminPage( 'theme-editor.php', 'file=theme.json' );
		await expect( page.locator( '#monaco-editor .monaco-editor' ) ).toBeVisible();

		// Change `$schema` and `version` at once so that the error is reported only by the new schema.
		await page.evaluate( () => {
			const model = window.editor?.getModel();
			model?.setValue(
				model
					.getValue()
					.replace(
						/"\$schema":\s*"[^"]*"/,
						'"$schema": "https://schemas.wp.org/wp/6.6/theme.json"'
					)
					.replace( /"version":\s*\d+/, '"version": "3"' )
			);
		} );

		await expect
			.poll( () =>
				page.evaluate( () =>
					window.monaco?.editor.getModelMarkers( {} ).map( ( { message } ) => message )
				)
			)
			.toContain( 'Incorrect type. Expected "integer".' );
	} );

	test( 'input by Emmet should be expanded on the block editor', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		await editor.canvas.locator( '[data-type="core/html"] .monaco-editor' ).click();
		await page.keyboard.type( 'ul.list>li.item*5' );
		await page.keyboard.down( 'Tab' );
		const postContent = await editor.getEditedPostContent();
		const replacedPostContent = postContent.replace( /\r\n/g, '\n' );

		expect( replacedPostContent ).toBe( `<!-- wp:html -->
<ul class="list">
  <li class="item"></li>
  <li class="item"></li>
  <li class="item"></li>
  <li class="item"></li>
  <li class="item"></li>
</ul>
<!-- /wp:html -->` );
	} );

	test( 'WordPress-specific syntax should be highlighted on the block editor', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		await expect( editor.canvas.locator( '[data-type="core/html"] .monaco-editor' ) ).toBeVisible();

		// The tokenizer is registered to the monaco instance loaded in the editor canvas iframe.
		const tokens = await page
			.locator( 'iframe[name="editor-canvas"]' )
			.evaluate( async ( iframe ) => {
				const { monaco } = ( iframe as HTMLIFrameElement ).contentWindow as Window;
				// The shortcode follows text to check that the text rule stops at `[`.
				const text = '<!-- wp:separator /--> [gallery ids="1"]';
				// Wait for the tokenizer, which is created lazily.
				await monaco?.editor.colorize( text, 'html', {} );
				return monaco?.editor
					.tokenize( text, 'html' )[ 0 ]
					.map( ( { offset, type }, index, lineTokens ) => [
						text.slice( offset, lineTokens[ index + 1 ]?.offset ),
						type,
					] );
			} );

		expect( tokens ).toEqual( [
			[ '<!--', 'delimiter.html' ],
			[ ' ', '' ],
			[ 'wp:separator', 'tag.html' ],
			[ ' ', '' ],
			[ '/-->', 'delimiter.html' ],
			[ ' ', '' ],
			[ '[', 'delimiter.html' ],
			[ 'gallery', 'tag.html' ],
			[ ' ', '' ],
			[ 'ids', 'attribute.name.html' ],
			[ '=', 'delimiter.html' ],
			[ '"1"', 'attribute.value.html' ],
			[ ']', 'delimiter.html' ],
		] );
	} );

	test( 'block should render in the default mode selected in the settings', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );

		// A block starts in the HTML editing mode.
		await expect(
			page.getByRole( 'button', { name: 'HTML', exact: true, pressed: true } )
		).toBeVisible();

		// Switch the default mode to Preview.
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'tab', { name: 'Settings' } ).click();
		await page
			.getByRole( 'radiogroup', { name: 'Default mode' } )
			.getByRole( 'radio', { name: 'Preview' } )
			.click();

		// The default mode is only applied when the block mounts, so re-render
		// it by switching the editor to the code mode and back.
		await page.evaluate( () =>
			( window.wp as any ).data.dispatch( 'core/editor' ).switchEditorMode( 'text' )
		);
		await page.evaluate( () =>
			( window.wp as any ).data.dispatch( 'core/editor' ).switchEditorMode( 'visual' )
		);

		// Select the re-rendered block to reveal its toolbar.
		await editor.canvas.getByRole( 'document', { name: 'Block: Custom HTML' } ).click();

		// The block now starts in the Preview mode.
		await expect(
			page.getByRole( 'button', { name: 'Preview', exact: true, pressed: true } )
		).toBeVisible();
	} );
} );

test.describe( 'Settings page', () => {
	test( 'should be rendered', async ( { admin, page } ) => {
		// Hide welcome guide.
		const welcomeGuide = page.getByRole( 'dialog', {
			name: 'About Custom HTML Block Extension',
		} );
		await page.addLocatorHandler( welcomeGuide, async () => {
			await welcomeGuide.getByRole( 'button', { name: 'Close' } ).click();
		} );
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );

		// Editsor config tab
		await expect( page.getByRole( 'button', { name: 'Save settings' } ) ).toBeVisible();
		// Tools tab
		await page.getByRole( 'tab', { name: 'Tools' } ).click();
		await expect( page.getByRole( 'button', { name: 'Export', exact: true } ) ).toBeVisible();
		// Options tab
		await page.getByRole( 'tab', { name: 'Options' } ).click();
		await expect( page.getByRole( 'button', { name: 'Save Options' } ) ).toBeVisible();
	} );

	test( 'tab focus mode should move focus out of the code editor', async ( { admin, page } ) => {
		// Hide welcome guide.
		const welcomeGuide = page.getByRole( 'dialog', {
			name: 'About Custom HTML Block Extension',
		} );
		await page.addLocatorHandler( welcomeGuide, async () => {
			await welcomeGuide.getByRole( 'button', { name: 'Close' } ).click();
		} );
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );

		const editor = page.locator( '.chbe-admin-editor-config-editor-preview .monaco-editor' );
		const textbox = editor.getByRole( 'textbox', {
			name: /^Editor content\. To change the Tab key behavior, press Ctrl\+(Shift\+)?M\.$/,
		} );

		await editor.click();
		await expect( textbox ).toBeFocused();

		// While tab focus mode is disabled, Tab stays inside the editor.
		await page.keyboard.press( 'Tab' );
		await expect( textbox ).toBeFocused();

		// The plugin picks the combo from navigator.platform (isAppleOS), while
		// Monaco maps Ctrl/Cmd from navigator.userAgent ("Macintosh" => Meta).
		const shortcut = await page.evaluate( () => {
			const { platform, userAgent } = window.navigator;
			const isAppleOS =
				platform.indexOf( 'Mac' ) !== -1 || [ 'iPad', 'iPhone' ].includes( platform );
			if ( isAppleOS ) {
				return 'Control+Shift+m';
			}
			return userAgent.includes( 'Macintosh' ) ? 'Meta+m' : 'Control+m';
		} );

		// Toggle tab focus mode.
		await page.keyboard.press( shortcut );

		// The change should be announced to screen readers.
		await expect( page.getByRole( 'button', { name: 'Dismiss this notice' } ) ).toContainText(
			'Pressing Tab will now move focus to the next focusable element.'
		);

		// Tab should move focus out of the editor to the Save settings button.
		await page.keyboard.press( 'Tab' );
		await expect( page.getByRole( 'button', { name: 'Save settings' } ) ).toBeFocused();
	} );
} );
