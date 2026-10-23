/**
 * External dependencies
 */
import type { Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const PLUGIN = 'custom-html-block-extension/custom-html-block-extension.php';

const FILES: { page: string; query: string; language: string }[] = [
	// Files opened without the `file` parameter.
	{ page: 'theme-editor.php', query: '', language: 'css' },
	{ page: 'plugin-editor.php', query: `plugin=${ PLUGIN }`, language: 'php' },
	// The language is chosen from the file extension.
	{ page: 'theme-editor.php', query: 'file=style.css', language: 'css' },
	{ page: 'theme-editor.php', query: 'file=theme.json', language: 'json' },
	{ page: 'theme-editor.php', query: 'file=templates/index.html', language: 'html' },
	{ page: 'theme-editor.php', query: 'file=functions.php', language: 'php' },
	{
		page: 'plugin-editor.php',
		query: `plugin=${ PLUGIN }&file=custom-html-block-extension/README.md`,
		language: 'markdown',
	},
	{
		page: 'plugin-editor.php',
		query: `plugin=${ PLUGIN }&file=custom-html-block-extension/test/e2e/fixtures/sample.xml`,
		language: 'xml',
	},
	{
		page: 'plugin-editor.php',
		query: `plugin=${ PLUGIN }&file=custom-html-block-extension/eslint.config.js`,
		language: 'javascript',
	},
];

function getLanguage( page: Page ) {
	return page.evaluate( () => window.editor?.getModel()?.getLanguageId() );
}

test.describe( 'Theme/plugin editor', () => {
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

	for ( const { page: adminPage, query, language } of FILES ) {
		test( `${ adminPage }?${ query } should be opened as ${ language }`, async ( {
			admin,
			page,
		} ) => {
			await admin.visitAdminPage( adminPage, query );
			await expect( page.locator( '.chbe-monaco-editor .monaco-editor' ) ).toBeVisible();
			await expect.poll( () => getLanguage( page ) ).toBe( language );
		} );
	}

	test( 'Ctrl+S should submit the form', async ( { admin, page } ) => {
		await admin.visitAdminPage( 'theme-editor.php', 'file=templates/index.html' );
		const monacoEditor = page.locator( '.chbe-monaco-editor .monaco-editor' );
		await expect( monacoEditor ).toBeVisible();

		// Block the request so that the file isn't changed.
		await page.route( '**/wp-admin/admin-ajax.php', ( route ) =>
			route.request().postData()?.includes( 'action=edit-theme-plugin-file' )
				? route.abort()
				: route.continue()
		);
		const requestPromise = page.waitForRequest(
			( request ) =>
				request.url().includes( 'admin-ajax.php' ) &&
				!! request.postData()?.includes( 'action=edit-theme-plugin-file' )
		);

		// Monaco determines the modifier key from the user agent, not from the OS running the test.
		const isMac = await page.evaluate( () => window.navigator.userAgent.includes( 'Macintosh' ) );
		await monacoEditor.click();
		await page.keyboard.press( isMac ? 'Meta+s' : 'Control+s' );

		const request = await requestPromise;
		expect( request.postData() ).toContain( 'file=templates%2Findex.html' );
	} );

	test( 'editing should warn before leaving the page', async ( { admin, page } ) => {
		await admin.visitAdminPage( 'theme-editor.php', 'file=templates/index.html' );
		const monacoEditor = page.locator( '.chbe-monaco-editor .monaco-editor' );
		await expect( monacoEditor ).toBeVisible();

		await expect
			.poll( () =>
				page.evaluate(
					() => ( window.wp as { themePluginEditor?: { dirty: boolean } } ).themePluginEditor?.dirty
				)
			)
			.toBe( false );

		const initialValue = await page.locator( '#newcontent' ).inputValue();
		await monacoEditor.click();
		await page.evaluate( () => window.editor?.setPosition( { lineNumber: 1, column: 1 } ) );
		await page.keyboard.type( 'chbe' );

		// The textarea is updated and marked as dirty.
		await expect( page.locator( '#newcontent' ) ).toHaveValue( `chbe${ initialValue }` );
		expect(
			await page.evaluate(
				() => ( window.wp as { themePluginEditor?: { dirty: boolean } } ).themePluginEditor?.dirty
			)
		).toBe( true );

		// Leaving the page shows the warning.
		const dialogTypes: string[] = [];
		page.once( 'dialog', async ( dialog ) => {
			dialogTypes.push( dialog.type() );
			await dialog.dismiss();
		} );
		await page.getByRole( 'link', { name: 'Dashboard', exact: true } ).first().click();
		await expect.poll( () => dialogTypes ).toEqual( [ 'beforeunload' ] );
		await expect( page ).toHaveURL( /theme-editor\.php/ );
	} );
} );
