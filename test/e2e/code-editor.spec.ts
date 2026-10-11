/**
 * External dependencies
 */
import type { Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Insert text into the code editor. Typing HTML with the keyboard is affected
 * by the auto closing of tags and comments, so the text is inserted with an edit.
 *
 * @param page     The page.
 * @param text     The text to insert.
 * @param position Where to insert the text.
 */
async function insertText( page: Page, text: string, position: 'start' | 'end' ) {
	await page.evaluate(
		( [ textToInsert, insertPosition ] ) => {
			const editor = window.monaco!.editor.getEditors()[ 0 ];
			const model = editor.getModel()!;
			const { lineNumber, column } =
				insertPosition === 'start'
					? { lineNumber: 1, column: 1 }
					: model.getFullModelRange().getEndPosition();
			editor.executeEdits( 'e2e', [
				{
					range: {
						startLineNumber: lineNumber,
						startColumn: column,
						endLineNumber: lineNumber,
						endColumn: column,
					},
					text: textToInsert,
				},
			] );
		},
		[ text, position ] as const
	);
}

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

		await insertText( page, '\n<!-- wp:paragraph --><p>World</p><!-- /wp:paragraph -->', 'end' );

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

	test.describe( 'Site editor', () => {
		test.beforeAll( async ( { requestUtils } ) => {
			await requestUtils.activateTheme( 'twentytwentyfive' );
		} );

		test.afterAll( async ( { requestUtils } ) => {
			await requestUtils.deleteAllTemplates( 'wp_template' );
		} );

		test( 'template content should be edited with the Monaco editor in the code editor', async ( {
			admin,
			page,
			editor,
			pageUtils,
		} ) => {
			await admin.visitSiteEditor( {
				postId: 'twentytwentyfive//index',
				postType: 'wp_template',
				canvas: 'edit',
			} );
			await pageUtils.pressKeys( 'secondary+M' );

			const codeEditor = page.locator( '.editor-text-editor .monaco-editor' );
			await expect( codeEditor ).toBeVisible();
			await expect( page.locator( 'textarea.editor-post-text-editor' ) ).toBeHidden();

			await insertText(
				page,
				'<!-- wp:paragraph --><p>Hello</p><!-- /wp:paragraph -->\n',
				'start'
			);

			// The content is parsed into blocks when switching back to the visual editor.
			await page.getByRole( 'button', { name: 'Exit code editor' } ).click();
			await expect
				.poll( async () => ( await editor.getBlocks() )[ 0 ] )
				.toMatchObject( { name: 'core/paragraph', attributes: { content: 'Hello' } } );
		} );
	} );
} );
