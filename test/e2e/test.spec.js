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
		await admin.visitAdminPage( '' );
		const wpPointerCloseButton = page.locator( '#wp-pointer-0 a.close' );
		const isVisible = await wpPointerCloseButton.isVisible();
		if ( isVisible ) {
			await wpPointerCloseButton.click();
		}
		await requestUtils.activatePlugin( 'classic-editor' );
		await admin.visitAdminPage( 'post-new.php' );
		await page.click( '#content-tmce' );
		await page.click( '#content-html' );
		await page.click( '#monaco-editor-container .monaco-editor' );
		await page.keyboard.type( 'p.selector' );
		await page.keyboard.down( 'Tab' );
		await page.click( '#publish' );
		await page.click( '#content-tmce' );
		await page.click( '#content-html' );
		const textarea = await page.locator( '#wp-content-editor-container textarea.wp-editor-area' );
		expect( textarea ).toHaveText( '<p class="selector"></p>' );
		await requestUtils.deactivatePlugin( 'classic-editor' );
	} );

	test( 'input by Emmet should be expanded on the theme editor', async ( {
		admin,
		page,
		pageUtils,
	} ) => {
		await admin.visitAdminPage( 'theme-editor.php' );
		await page.click( '#monaco-editor-container .monaco-editor' );
		await pageUtils.pressKeys( 'primary+a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( '.selector{fz100', { delay: 50 } );
		await page.keyboard.press( 'Tab' );
		await page.click( '#submit' );
		const textarea = await page.locator( '#newcontent' );
		expect( textarea ).toHaveText( '.selector{font-size: 100px;}' );
	} );

	test( 'input by Emmet should be expanded on the block editor', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );

		// The editor is not iframed in WordPress 6.2.
		const body = await page.$( 'body' );
		const bodyClassNames = await ( await body.getProperty( 'className' ) ).jsonValue();
		const matches = bodyClassNames.match( /branch-([0-9]*-*[0-9])/ );
		const wpVersion = matches?.[ 1 ];

		if ( wpVersion === '6-2' ) {
			await page.locator( '[data-type="core/html"] .monaco-editor' ).click();
		} else {
			await editor.canvas.locator( '[data-type="core/html"] .monaco-editor' ).click();
		}

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
} );
