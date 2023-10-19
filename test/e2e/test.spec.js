/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Editor', () => {
	test( 'input by Emmet should be expanded on classic editor', async ( {
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

	test( 'input by Emmet should be expanded on theme editor', async ( {
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

	test( 'input by Emmet should be expanded on block editor', async ( { admin, page, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		const monacoEditor = editor.canvas.locator( '[data-type="core/html"] .monaco-editor' );
		await monacoEditor.click();
		await page.keyboard.type( 'ul.list>li.item*5' );
		await page.keyboard.down( 'Tab' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );
} );
