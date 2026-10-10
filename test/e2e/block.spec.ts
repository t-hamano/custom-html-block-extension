/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Block', () => {
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

	test( 'block HTML should be edited with the code editor in the "Edit as HTML" mode', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/paragraph', attributes: { content: 'Hello' } } );
		await editor.clickBlockOptionsMenuItem( 'Edit as HTML' );

		const codeEditor = editor.canvas.locator( '[data-type="core/paragraph"] .monaco-editor' );
		await expect( codeEditor ).toBeVisible();
		await expect(
			editor.canvas.locator( '.block-editor-block-list__block-html-textarea' )
		).toHaveCount( 0 );

		// Type before the closing tag of `<p>Hello</p>`.
		await codeEditor.click();
		await page.keyboard.press( 'End' );
		for ( let i = 0; i < 4; i++ ) {
			await page.keyboard.press( 'ArrowLeft' );
		}
		await page.keyboard.type( ' World' );

		// The changes are committed on blur.
		await editor.canvas.getByRole( 'textbox', { name: 'Add title' } ).click();
		await expect
			.poll( editor.getBlocks )
			.toMatchObject( [ { name: 'core/paragraph', attributes: { content: 'Hello World' } } ] );

		// Switching to the visual mode while the code editor has focus keeps the content.
		await codeEditor.click();
		await page.evaluate( () => {
			const { dispatch, select } = ( window.wp as any ).data;
			const [ clientId ] = select( 'core/block-editor' ).getBlockOrder();
			dispatch( 'core/block-editor' ).toggleBlockMode( clientId );
		} );
		await expect( editor.canvas.getByRole( 'document', { name: 'Block: Paragraph' } ) ).toHaveText(
			'Hello World'
		);
	} );

	test( 'core textarea should be used when the option is disabled', async ( {
		admin,
		editor,
		requestUtils,
	} ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/custom-html-block-extension/v1/update_options',
			data: { options: { permissionBlockEditor: false } },
		} );
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/paragraph', attributes: { content: 'Hello' } } );
		await editor.clickBlockOptionsMenuItem( 'Edit as HTML' );

		await expect(
			editor.canvas.locator( '.block-editor-block-list__block-html-textarea' )
		).toHaveValue( '<p>Hello</p>' );
		await expect(
			editor.canvas.locator( '[data-type="core/paragraph"] .monaco-editor' )
		).toHaveCount( 0 );
	} );
} );
