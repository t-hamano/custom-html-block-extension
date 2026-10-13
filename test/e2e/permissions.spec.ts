/**
 * External dependencies
 */
import type { Locator, Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { test, expect, type Admin, type Editor } from '@wordpress/e2e-test-utils-playwright';

type Fixtures = { admin: Admin; editor: Editor; page: Page };

const AUTHOR = {
	username: 'chbe-author',
	email: 'chbe-author@example.com',
	password: 'password',
	roles: [ 'author' ],
};

async function openBlockEditor( { admin, editor }: Fixtures ) {
	await admin.createNewPost();
	await editor.insertBlock( { name: 'core/html' } );
	return editor.canvas.locator( '[data-type="core/html"]' );
}

// Whether the plugin script, which localizes `chbeObj`, is loaded.
function isScriptLoaded( page: Page ) {
	return page.evaluate( () => 'chbeObj' in window );
}

const EDITORS: {
	name: string;
	option: string;
	plugin?: string;
	open: ( fixtures: Fixtures ) => Promise< Locator >;
}[] = [
	{
		name: 'block editor',
		option: 'permissionBlockEditor',
		open: openBlockEditor,
	},
	{
		name: 'classic editor',
		option: 'permissionClassicEditor',
		plugin: 'classic-editor',
		open: async ( { admin, page } ) => {
			await admin.visitAdminPage( 'post-new.php' );
			return page.locator( '#wp-content-wrap' );
		},
	},
	{
		name: 'theme editor',
		option: 'permissionThemePluginEditor',
		open: async ( { admin, page } ) => {
			await admin.visitAdminPage( 'theme-editor.php' );
			// CodeMirror is used instead.
			return page.locator( '.CodeMirror' );
		},
	},
];

test.describe( 'Permissions', () => {
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

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { custom_html_block_extension_options: null },
		} );
	} );

	for ( const target of EDITORS ) {
		test.describe( target.name, () => {
			test.beforeAll( async ( { requestUtils } ) => {
				if ( target.plugin ) {
					await requestUtils.activatePlugin( target.plugin );
				} else {
					await requestUtils.deactivatePlugin( 'classic-editor' );
				}
			} );

			test.afterAll( async ( { requestUtils } ) => {
				if ( target.plugin ) {
					await requestUtils.deactivatePlugin( target.plugin );
				}
			} );

			test( 'code editor should not be loaded when the editor is disabled in the options', async ( {
				admin,
				editor,
				page,
				requestUtils,
			} ) => {
				await requestUtils.rest( {
					method: 'POST',
					path: '/wp/v2/settings',
					data: { custom_html_block_extension_options: { [ target.option ]: false } },
				} );

				const coreEditor = await target.open( { admin, editor, page } );
				await expect( coreEditor ).toBeVisible();
				expect( await isScriptLoaded( page ) ).toBe( false );
				await expect( page.locator( '.monaco-editor' ) ).toHaveCount( 0 );
			} );
		} );
	}

	test.describe( 'user role', () => {
		test.beforeAll( async ( { requestUtils } ) => {
			await requestUtils.deactivatePlugin( 'classic-editor' );
			await requestUtils.createUser( AUTHOR );
		} );

		test.afterAll( async ( { requestUtils } ) => {
			await requestUtils.deleteAllUsers();
		} );

		test( 'code editor should not be loaded for a user whose role is not allowed', async ( {
			admin,
			editor,
			page,
			requestUtils,
		} ) => {
			await requestUtils.rest( {
				method: 'POST',
				path: '/wp/v2/settings',
				data: {
					custom_html_block_extension_options: {
						permissionRoles: [ 'administrator', 'editor', 'contributor' ],
					},
				},
			} );

			// Log in as the author in the browser.
			await page.context().clearCookies();
			await page.request.post( 'wp-login.php', {
				failOnStatusCode: true,
				form: { log: AUTHOR.username, pwd: AUTHOR.password },
			} );

			const coreEditor = await openBlockEditor( { admin, editor, page } );
			await expect( coreEditor ).toBeVisible();
			expect( await isScriptLoaded( page ) ).toBe( false );
			await expect( editor.canvas.locator( '.monaco-editor' ) ).toHaveCount( 0 );
		} );
	} );
} );
