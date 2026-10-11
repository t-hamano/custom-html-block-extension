/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Code editor', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin( 'classic-editor' );
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/custom-html-block-extension/v1/update_options',
			data: { options: { permissionBlockEditor: true } },
		} );
	} );

	test( 'post content should be edited with the Monaco editor in the code editor', async ( {
		admin,
		page,
		editor,
		pageUtils,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/paragraph', attributes: { content: 'Hello' } } );
		await pageUtils.pressKeys( 'secondary+M' );

		const codeEditor = page.locator( '.editor-text-editor .monaco-editor' );
		await expect( codeEditor ).toBeVisible();
		await expect( page.locator( 'textarea.editor-post-text-editor' ) ).toBeHidden();

		// Type at the end of the content.
		await codeEditor.click();
		await pageUtils.pressKeys( 'primary+End' );
		await page.keyboard.type( '\n<!-- wp:paragraph --><p>World</p><!-- /wp:paragraph -->' );

		// The content is parsed into blocks when switching back to the visual editor.
		await page.getByRole( 'button', { name: 'Exit code editor' } ).click();
		await expect.poll( editor.getBlocks ).toMatchObject( [
			{ name: 'core/paragraph', attributes: { content: 'Hello' } },
			{ name: 'core/paragraph', attributes: { content: 'World' } },
		] );
	} );

	test( 'core textarea should be used when the option is disabled', async ( {
		admin,
		page,
		requestUtils,
		pageUtils,
	} ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/custom-html-block-extension/v1/update_options',
			data: { options: { permissionBlockEditor: false } },
		} );
		await admin.createNewPost();
		await pageUtils.pressKeys( 'secondary+M' );

		await expect( page.locator( 'textarea.editor-post-text-editor' ) ).toBeVisible();
		await expect( page.locator( '.editor-text-editor .monaco-editor' ) ).toHaveCount( 0 );
	} );
} );
