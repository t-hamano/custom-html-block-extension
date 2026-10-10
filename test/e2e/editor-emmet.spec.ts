/**
 * External dependencies
 */
import type { Locator, Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { test, expect, type Admin, type Editor } from '@wordpress/e2e-test-utils-playwright';

type Fixtures = { admin: Admin; editor: Editor; page: Page };

const HTML_CASES = [
	{
		abbreviation: 'div#id.a.b',
		expected: '<div id="id" class="a b"></div>',
	},
	{
		abbreviation: 'a[href="#"]{link}',
		expected: '<a href="#">link</a>',
	},
	{
		abbreviation: 'input:email',
		expected: '<input type="email" name="" id="">',
	},
	{
		abbreviation: '(header>nav)+footer',
		expected: `<header>
  <nav></nav>
</header>
<footer></footer>`,
	},
	{
		abbreviation: 'ul.list>li.item*3',
		expected: `<ul class="list">
  <li class="item"></li>
  <li class="item"></li>
  <li class="item"></li>
</ul>`,
	},
];

const CSS_CASES = [
	{
		abbreviation: 'fz100',
		expected: 'font-size: 100px;',
	},
	{
		abbreviation: 'm10-20',
		expected: 'margin: 10px 20px;',
	},
	{
		abbreviation: 'bd1-s#000',
		expected: 'border: 1px solid #000;',
	},
	{
		abbreviation: 'dn',
		expected: 'display: none;',
	},
];

async function expand( page: Page, monacoEditor: Locator, abbreviation: string, label: string ) {
	await page.keyboard.type( abbreviation );
	await expect(
		monacoEditor.getByRole( 'listbox', { name: 'Suggest' } ).getByLabel( label )
	).toBeVisible();
	await page.keyboard.press( 'Tab' );
}

const EDITORS: {
	name: string;
	plugin?: string;
	open: ( fixtures: Fixtures ) => Promise< Locator >;
	getValue: ( fixtures: Fixtures ) => Promise< string >;
}[] = [
	{
		name: 'theme editor (HTML)',
		open: async ( { admin, page } ) => {
			await admin.visitAdminPage( 'theme-editor.php', 'file=templates/index.html' );
			const monacoEditor = page.locator( '#monaco-editor .monaco-editor' );
			await monacoEditor.click();
			const shortcut = await page.evaluate( () =>
				window.navigator.userAgent.includes( 'Macintosh' ) ? 'Meta+a' : 'Control+a'
			);
			await page.keyboard.press( shortcut );
			await page.keyboard.press( 'Delete' );
			return monacoEditor;
		},
		getValue: ( { page } ) => page.locator( '#newcontent' ).inputValue(),
	},
	{
		name: 'classic editor',
		plugin: 'classic-editor',
		open: async ( { admin, page } ) => {
			await admin.visitAdminPage( 'post-new.php' );
			await page.locator( '#content-tmce' ).click();
			await page.locator( '#content-html' ).click();
			const monacoEditor = page.locator( '#monaco-editor .monaco-editor' );
			await monacoEditor.click();
			return monacoEditor;
		},
		getValue: ( { page } ) => page.locator( '#content' ).inputValue(),
	},
	{
		name: 'block editor',
		open: async ( { admin, editor } ) => {
			await admin.createNewPost();
			await editor.insertBlock( { name: 'core/html' } );
			const monacoEditor = editor.canvas.locator( '[data-type="core/html"] .monaco-editor' );
			await monacoEditor.click();
			return monacoEditor;
		},
		getValue: async ( { editor } ) =>
			( await editor.getEditedPostContent() )
				.replace( /\r\n/g, '\n' )
				.replace( /^<!-- wp:html -->\n|\n<!-- \/wp:html -->$/g, '' ),
	},
];

test.describe( 'Emmet', () => {
	test.beforeEach( async ( { page } ) => {
		// Hide WP pointer.
		await page.addLocatorHandler( page.locator( '#wp-pointer-0' ), async ( wpPointer ) => {
			await wpPointer.locator( 'a.close' ).click();
		} );
		// Hide file editor warning modal.
		const dismissButton = page.locator( '.file-editor-warning-dismiss' );
		await page.addLocatorHandler( dismissButton, async () => {
			await dismissButton.click();
		} );
	} );

	for ( const target of EDITORS ) {
		test.describe( target.name, () => {
			test.beforeAll( async ( { requestUtils } ) => {
				if ( target.plugin ) {
					await requestUtils.activatePlugin( target.plugin );
				}
			} );

			test.afterAll( async ( { requestUtils } ) => {
				if ( target.plugin ) {
					await requestUtils.deactivatePlugin( target.plugin );
				}
			} );

			for ( const { abbreviation, expected } of HTML_CASES ) {
				test( `should expand "${ abbreviation }"`, async ( { admin, editor, page } ) => {
					const fixtures = { admin, editor, page };
					const monacoEditor = await target.open( fixtures );
					await expand( page, monacoEditor, abbreviation, abbreviation );
					await expect.poll( () => target.getValue( fixtures ) ).toBe( expected );
				} );
			}
		} );
	}

	test.describe( 'theme editor (CSS)', () => {
		for ( const { abbreviation, expected } of CSS_CASES ) {
			test( `should expand "${ abbreviation }"`, async ( { admin, page } ) => {
				await admin.visitAdminPage( 'theme-editor.php', 'file=style.css' );
				const monacoEditor = page.locator( '#monaco-editor .monaco-editor' );
				await monacoEditor.click();
				const shortcut = await page.evaluate( () =>
					window.navigator.userAgent.includes( 'Macintosh' ) ? 'Meta+a' : 'Control+a'
				);
				await page.keyboard.press( shortcut );
				await page.keyboard.press( 'Delete' );
				await page.keyboard.type( '.selector{' );
				await expand( page, monacoEditor, abbreviation, expected );
				await expect( page.locator( '#newcontent' ) ).toHaveValue( `.selector{${ expected }}` );
			} );
		}
	} );
} );
