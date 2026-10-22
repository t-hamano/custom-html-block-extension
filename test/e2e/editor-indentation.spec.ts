/**
 * External dependencies
 */
import type { Locator, Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
import {
	test,
	expect,
	type Admin,
	type Editor,
	type RequestUtils,
} from '@wordpress/e2e-test-utils-playwright';

type Fixtures = { admin: Admin; editor: Editor; page: Page; requestUtils: RequestUtils };

// Indented with tabs, while the indentation setting defaults to two spaces.
const CONTENT = '<div>\n\t<p></p>\n</div>';

async function getIndentation( monacoEditor: Locator ) {
	return monacoEditor.evaluate( ( element ) => {
		const editor = element.ownerDocument.defaultView?.monaco?.editor
			.getEditors()
			.find( ( instance ) => instance.getDomNode() === element );
		const { insertSpaces, tabSize } = editor?.getModel()?.getOptions() ?? {};
		return { insertSpaces, tabSize };
	} );
}

const EDITORS: {
	name: string;
	plugin?: string;
	open: ( fixtures: Fixtures ) => Promise< Locator >;
	cleanup?: ( fixtures: Fixtures ) => Promise< void >;
}[] = [
	{
		name: 'theme editor',
		open: async ( { admin, page } ) => {
			// The template is indented with tabs.
			await admin.visitAdminPage( 'theme-editor.php', 'file=templates/index.html' );
			return page.locator( '.chbe-monaco-editor .monaco-editor' );
		},
	},
	{
		name: 'classic editor',
		plugin: 'classic-editor',
		open: async ( { admin, page, requestUtils } ) => {
			// Switch to the text mode so that the post is opened in it.
			await admin.visitAdminPage( 'post-new.php' );
			await page.locator( '#content-tmce' ).click();
			await page.locator( '#content-html' ).click();
			await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();

			const { id } = await requestUtils.rest( {
				method: 'POST',
				path: '/wp/v2/posts',
				data: { content: CONTENT },
			} );
			await admin.visitAdminPage( 'post.php', `post=${ id }&action=edit` );
			return page.locator( '.chbe-monaco-editor .monaco-editor' );
		},
		// Switch back to the visual mode, which is saved on the next page load.
		cleanup: async ( { admin, page } ) => {
			await admin.visitAdminPage( 'post-new.php' );
			await page.locator( '#content-tmce' ).click();
			await admin.visitAdminPage( 'index.php' );
		},
	},
	{
		name: 'block editor',
		open: async ( { admin, editor } ) => {
			await admin.createNewPost();
			await editor.insertBlock( { name: 'core/html', attributes: { content: CONTENT } } );
			return editor.canvas.locator( '[data-type="core/html"] .monaco-editor' );
		},
	},
];

test.describe( 'Indentation', () => {
	test.beforeEach( async ( { page } ) => {
		// Hide WP pointer. Dispatch the click because the file editor warning modal may cover it.
		await page.addLocatorHandler( page.locator( '#wp-pointer-0' ), async ( wpPointer ) => {
			await wpPointer.locator( 'a.close' ).dispatchEvent( 'click' );
		} );
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: {
				custom_html_block_extension_editor_settings: null,
				custom_html_block_extension_editor_options: null,
			},
		} );
		await requestUtils.deleteAllPosts();
	} );

	for ( const target of EDITORS ) {
		test.describe( target.name, () => {
			test.beforeAll( async ( { requestUtils } ) => {
				if ( target.plugin ) {
					await requestUtils.activatePlugin( target.plugin );
				}
			} );

			test.afterEach( async ( { admin, editor, page, requestUtils } ) => {
				await target.cleanup?.( { admin, editor, page, requestUtils } );
			} );

			test.afterAll( async ( { requestUtils } ) => {
				if ( target.plugin ) {
					await requestUtils.deactivatePlugin( target.plugin );
				}
			} );

			for ( const detectIndentation of [ false, true ] ) {
				test( `should ${
					detectIndentation ? 'detect' : 'not detect'
				} the indentation from the content`, async ( { admin, editor, page, requestUtils } ) => {
					await requestUtils.rest( {
						method: 'POST',
						path: '/wp/v2/settings',
						data: { custom_html_block_extension_editor_settings: { detectIndentation } },
					} );

					const monacoEditor = await target.open( { admin, editor, page, requestUtils } );
					await expect
						.poll( () => getIndentation( monacoEditor ) )
						.toEqual(
							detectIndentation
								? { insertSpaces: false, tabSize: 4 }
								: { insertSpaces: true, tabSize: 4 }
						);
				} );
			}
		} );
	}
} );
