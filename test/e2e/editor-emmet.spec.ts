/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Emmet', () => {
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
		// Emmet expands via the suggest widget, so Tab must wait for the suggestion.
		await expect(
			page.getByRole( 'listbox', { name: 'Suggest' } ).getByLabel( 'p.selector' )
		).toBeVisible();
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
		await expect(
			page.getByRole( 'listbox', { name: 'Suggest' } ).getByLabel( 'font-size: 100px;' )
		).toBeVisible();
		await page.keyboard.press( 'Tab' );
		const textarea = page.locator( '#newcontent' );
		await expect( textarea ).toHaveValue( '.selector{font-size: 100px;}' );
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
		await expect(
			editor.canvas.getByRole( 'listbox', { name: 'Suggest' } ).getByLabel( 'ul.list>li.item*5' )
		).toBeVisible();
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
} );
