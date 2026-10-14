/**
 * External dependencies
 */
import type { FrameLocator, Locator, Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { test, expect, type Admin, type Editor } from '@wordpress/e2e-test-utils-playwright';

type Fixtures = { admin: Admin; editor: Editor; page: Page };

const COMMAND_LABEL = 'Emmet: Wrap with Abbreviation';

async function getShortcut( page: Page, key: string ) {
	const modifier = await page.evaluate( () =>
		window.navigator.userAgent.includes( 'Macintosh' ) ? 'Meta' : 'Control'
	);
	return `${ modifier }+${ key }`;
}

async function clearEditor( page: Page, monacoEditor: Locator ) {
	await monacoEditor.click();
	await page.keyboard.press( await getShortcut( page, 'a' ) );
	await page.keyboard.press( 'Delete' );
}

async function openWrapInput(
	page: Page,
	monacoEditor: Locator,
	frame: Page | FrameLocator = page
) {
	await page.keyboard.press( 'F1' );
	await page.keyboard.type( COMMAND_LABEL );
	await expect( monacoEditor.locator( '.quick-input-list' ) ).toContainText( COMMAND_LABEL );
	await page.keyboard.press( 'Enter' );
	const input = frame.getByRole( 'textbox', { name: 'Abbreviation' } );
	await expect( input ).toBeFocused();
	return input;
}

const EDITORS: {
	name: string;
	plugin?: string;
	open: ( fixtures: Fixtures ) => Promise< Locator >;
	getFrame: ( fixtures: Fixtures ) => Page | FrameLocator;
	getValue: ( fixtures: Fixtures ) => Promise< string >;
}[] = [
	{
		name: 'theme editor',
		open: async ( { admin, page } ) => {
			await admin.visitAdminPage( 'theme-editor.php', 'file=templates/index.html' );
			const monacoEditor = page.locator( '.chbe-monaco-editor .monaco-editor' );
			await clearEditor( page, monacoEditor );
			return monacoEditor;
		},
		getFrame: ( { page } ) => page,
		getValue: ( { page } ) => page.locator( '#newcontent' ).inputValue(),
	},
	{
		name: 'classic editor',
		plugin: 'classic-editor',
		open: async ( { admin, page } ) => {
			await admin.visitAdminPage( 'post-new.php' );
			await page.locator( '#content-tmce' ).click();
			await page.locator( '#content-html' ).click();
			const monacoEditor = page.locator( '.chbe-monaco-editor .monaco-editor' );
			await monacoEditor.click();
			return monacoEditor;
		},
		getFrame: ( { page } ) => page,
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
		getFrame: ( { editor } ) => editor.canvas,
		getValue: async ( { editor } ) =>
			( await editor.getEditedPostContent() )
				.replace( /\r\n/g, '\n' )
				.replace( /^<!-- wp:html -->\n|\n<!-- \/wp:html -->$/g, '' ),
	},
];

test.describe( 'Wrap with Abbreviation', () => {
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

			test( 'should wrap the selection', async ( { admin, editor, page } ) => {
				const fixtures = { admin, editor, page };
				const monacoEditor = await target.open( fixtures );
				await page.keyboard.type( 'This span should be in red' );
				await page.keyboard.press( await getShortcut( page, 'a' ) );
				const input = await openWrapInput( page, monacoEditor, target.getFrame( fixtures ) );
				await input.pressSequentially( 'span.red' );
				await page.keyboard.press( 'Enter' );
				await expect( input ).toBeHidden();
				await expect
					.poll( () => target.getValue( fixtures ) )
					.toBe( '<span class="red">This span should be in red</span>' );
			} );

			test( 'should not change the content when canceled', async ( { admin, editor, page } ) => {
				const fixtures = { admin, editor, page };
				const monacoEditor = await target.open( fixtures );
				await page.keyboard.type( 'text' );
				await page.keyboard.press( await getShortcut( page, 'a' ) );
				const input = await openWrapInput( page, monacoEditor, target.getFrame( fixtures ) );
				await input.pressSequentially( 'div' );
				// The result is previewed in the editor.
				await expect( monacoEditor.locator( '.view-lines' ) ).toContainText( '<div>text</div>' );
				await page.keyboard.press( 'Escape' );
				await expect( input ).toBeHidden();
				await expect( monacoEditor.locator( '.view-lines' ) ).toHaveText( 'text' );
				await expect.poll( () => target.getValue( fixtures ) ).toBe( 'text' );
			} );
		} );
	}

	test.describe( 'theme editor', () => {
		test( 'should wrap each line with the repeater', async ( { admin, editor, page } ) => {
			const fixtures = { admin, editor, page };
			const [ target ] = EDITORS;
			const monacoEditor = await target.open( fixtures );
			// Set the value directly so that the Emmet suggestion, e.g. "footer", isn't accepted.
			await page.evaluate( () => window.editor?.setValue( 'foo\nbar' ) );
			await page.keyboard.press( await getShortcut( page, 'a' ) );
			const input = await openWrapInput( page, monacoEditor );
			await input.pressSequentially( 'ul>li*' );
			await page.keyboard.press( 'Enter' );
			await expect
				.poll( () => target.getValue( fixtures ) )
				.toBe( '<ul>\n  <li>foo</li>\n  <li>bar</li>\n</ul>' );
		} );

		test( 'should wrap the current line without selection', async ( { admin, editor, page } ) => {
			const fixtures = { admin, editor, page };
			const [ target ] = EDITORS;
			const monacoEditor = await target.open( fixtures );
			await page.keyboard.type( 'text' );
			const input = await openWrapInput( page, monacoEditor );
			await input.pressSequentially( 'p.a' );
			await page.keyboard.press( 'Enter' );
			await expect.poll( () => target.getValue( fixtures ) ).toBe( '<p class="a">text</p>' );
		} );

		test( 'should keep dollar signs in the text', async ( { admin, editor, page } ) => {
			const fixtures = { admin, editor, page };
			const [ target ] = EDITORS;
			const monacoEditor = await target.open( fixtures );
			await page.evaluate( () => window.editor?.setValue( "s.replace( /a/, '$1 $$' )" ) );
			await page.keyboard.press( await getShortcut( page, 'a' ) );
			const input = await openWrapInput( page, monacoEditor );
			await input.pressSequentially( 'script' );
			await page.keyboard.press( 'Enter' );
			await expect
				.poll( () => target.getValue( fixtures ) )
				.toBe( "<script>s.replace( /a/, '$1 $$' )</script>" );
		} );

		test( 'should be undone at once', async ( { admin, editor, page } ) => {
			const fixtures = { admin, editor, page };
			const [ target ] = EDITORS;
			const monacoEditor = await target.open( fixtures );
			await page.keyboard.type( 'text' );
			await page.keyboard.press( await getShortcut( page, 'a' ) );
			const input = await openWrapInput( page, monacoEditor );
			await input.pressSequentially( 'section>div' );
			await page.keyboard.press( 'Enter' );
			await expect
				.poll( () => target.getValue( fixtures ) )
				.toBe( '<section>\n  <div>text</div>\n</section>' );
			await page.keyboard.press( await getShortcut( page, 'z' ) );
			await expect.poll( () => target.getValue( fixtures ) ).toBe( 'text' );
		} );

		test( 'should be available from the context menu', async ( { admin, editor, page } ) => {
			const fixtures = { admin, editor, page };
			const [ target ] = EDITORS;
			const monacoEditor = await target.open( fixtures );
			await page.keyboard.type( 'text' );
			await page.keyboard.press( await getShortcut( page, 'a' ) );
			await monacoEditor.locator( '.view-lines' ).click( { button: 'right' } );
			const input = page.getByRole( 'textbox', { name: 'Abbreviation' } );
			// Retry since the menu may ignore a click right after it opens.
			await expect( async () => {
				await page.getByRole( 'menuitem', { name: COMMAND_LABEL } ).click();
				await expect( input ).toBeVisible( { timeout: 1000 } );
			} ).toPass();
			await expect( input ).toBeFocused();
			await input.pressSequentially( 'b' );
			await page.keyboard.press( 'Enter' );
			await expect.poll( () => target.getValue( fixtures ) ).toBe( '<b>text</b>' );
		} );
	} );
} );
