/**
 * External dependencies
 */
import type { Locator, Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { test, expect, type Editor } from '@wordpress/e2e-test-utils-playwright';

/**
 * Replace the value of a Monaco editor. Typing HTML with the keyboard is affected
 * by the auto closing of tags and comments, so the value is replaced with an edit.
 *
 * @param monacoEditor The Monaco editor element.
 * @param value        The new value.
 */
async function setValue( monacoEditor: Locator, value: string ) {
	await monacoEditor.evaluate( ( element, newValue ) => {
		const editor = element.ownerDocument.defaultView?.monaco?.editor
			.getEditors()
			.find( ( instance ) => instance.getDomNode() === element );
		const model = editor?.getModel();
		if ( ! editor || ! model ) {
			throw new Error( 'Monaco editor not found.' );
		}
		editor.executeEdits( 'e2e', [ { range: model.getFullModelRange(), text: newValue } ] );
	}, value );
}

async function getValue( monacoEditor: Locator ) {
	return monacoEditor.evaluate( ( element ) =>
		element.ownerDocument.defaultView?.monaco?.editor
			.getEditors()
			.find( ( instance ) => instance.getDomNode() === element )
			?.getValue()
	);
}

async function setPosition( monacoEditor: Locator, lineNumber: number, column: number ) {
	await monacoEditor.evaluate(
		( element, position ) => {
			element.ownerDocument.defaultView?.monaco?.editor
				.getEditors()
				.find( ( instance ) => instance.getDomNode() === element )
				?.setPosition( position );
		},
		{ lineNumber, column }
	);
}

async function getPostContent( page: Page ) {
	return page.evaluate( () =>
		( window.wp as any ).data.select( 'core/editor' ).getEditedPostContent()
	);
}

function getBlockEditor( editor: Editor ) {
	return editor.canvas.locator( '[data-type="core/html"] .monaco-editor' ).first();
}

test.describe( 'Block', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin( 'classic-editor' );
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: {
				custom_html_block_extension_options: { permissionBlockEditor: true },
				custom_html_block_extension_editor_options: null,
			},
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
			path: '/wp/v2/settings',
			data: { custom_html_block_extension_options: { permissionBlockEditor: false } },
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

	test( 'HTML and Preview modes should be switched from the toolbar', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'core/html',
			attributes: { content: '<p class="chbe-test">Hello</p>' },
		} );
		await expect( getBlockEditor( editor ) ).toBeVisible();

		await page.getByRole( 'button', { name: 'Preview', exact: true } ).click();
		await expect(
			page.getByRole( 'button', { name: 'Preview', exact: true, pressed: true } )
		).toBeVisible();
		await expect( editor.canvas.locator( '[data-type="core/html"] .chbe-test' ) ).toHaveText(
			'Hello'
		);
		await expect( getBlockEditor( editor ) ).toHaveCount( 0 );

		await page.getByRole( 'button', { name: 'HTML', exact: true } ).click();
		await expect(
			page.getByRole( 'button', { name: 'HTML', exact: true, pressed: true } )
		).toBeVisible();
		await expect( getBlockEditor( editor ) ).toBeVisible();
		expect( await getValue( getBlockEditor( editor ) ) ).toBe( '<p class="chbe-test">Hello</p>' );
	} );

	test( 'editing in the fullscreen HTML editor should be reflected in the block', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html', attributes: { content: '<p>Hello</p>' } } );
		await expect( getBlockEditor( editor ) ).toBeVisible();

		await page.getByRole( 'button', { name: 'Open HTML editor' } ).click();
		const dialog = page.getByRole( 'dialog', { name: 'HTML editor' } );
		const dialogEditor = dialog.locator( '.monaco-editor' );
		await expect( dialogEditor ).toBeVisible();
		expect( await getValue( dialogEditor ) ).toBe( '<p>Hello</p>' );

		await setValue( dialogEditor, '<p>Hello World</p>' );
		await dialog.getByRole( 'button', { name: 'Close' } ).click();
		await expect( dialog ).toBeHidden();

		await expect.poll( () => getPostContent( page ) ).toContain( '<p>Hello World</p>' );
		await expect.poll( () => getValue( getBlockEditor( editor ) ) ).toBe( '<p>Hello World</p>' );
	} );

	test( 'resizing the editor should save the height within the allowed range', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		await expect( getBlockEditor( editor ) ).toBeVisible();

		const handle = editor.canvas.locator(
			'[data-type="core/html"] .components-resizable-box__handle'
		);
		const resizeBy = async ( deltaY: number ) => {
			const box = ( await handle.boundingBox() )!;
			const x = box.x + box.width / 2;
			const y = box.y + box.height / 2;
			await page.mouse.move( x, y );
			await page.mouse.down();
			// Move in steps so the resize is tracked.
			await page.mouse.move( x, y + deltaY, { steps: 10 } );
			await page.mouse.up();
		};
		const getHeight = async () =>
			( await editor.getBlocks() )[ 0 ]?.attributes.height as number | undefined;

		expect( await getHeight() ).toBe( 300 );

		await resizeBy( 100 );
		await expect.poll( getHeight ).toBe( 400 );

		await resizeBy( -1000 );
		await expect.poll( getHeight ).toBe( 100 );
	} );

	test( 'block delimiters in the HTML should create inner blocks', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		const monacoEditor = getBlockEditor( editor );
		await expect( monacoEditor ).toBeVisible();

		await setValue(
			monacoEditor,
			'<div>\n<!-- wp:paragraph -->\n<p>Inner</p>\n<!-- /wp:paragraph -->\n</div>'
		);
		await expect.poll( editor.getBlocks ).toMatchObject( [
			{
				name: 'core/html',
				innerBlocks: [ { name: 'core/paragraph', attributes: { content: 'Inner' } } ],
			},
		] );
		const getInnerClientId = () =>
			page.evaluate(
				() =>
					( window.wp as any ).data.select( 'core/block-editor' ).getBlocks()[ 0 ].innerBlocks[ 0 ]
						?.clientId
			);
		const innerClientId = await getInnerClientId();

		// Editing only the surrounding HTML keeps the inner blocks.
		await setValue(
			monacoEditor,
			'<section>\n<!-- wp:paragraph -->\n<p>Inner</p>\n<!-- /wp:paragraph -->\n</section>'
		);
		await expect.poll( () => getPostContent( page ) ).toContain( '<section>' );
		expect( await getInnerClientId() ).toBe( innerClientId );
	} );

	test( 'a block created with the content attribute should be migrated to inner content', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await page.evaluate( () => {
			const { blocks, data } = window.wp as any;
			data
				.dispatch( 'core/block-editor' )
				.insertBlocks( blocks.createBlock( 'core/html', { content: '<p>Migrated</p>' } ) );
		} );
		await expect( getBlockEditor( editor ) ).toBeVisible();

		await expect
			.poll( async () => ( await editor.getBlocks() )[ 0 ]?.attributes.content )
			.toBeUndefined();
		await expect.poll( () => getPostContent( page ) ).toContain( '<p>Migrated</p>' );
		expect( await getValue( getBlockEditor( editor ) ) ).toBe( '<p>Migrated</p>' );
	} );

	test( 'copy and cut without a selection should apply to the current line', async ( {
		admin,
		page,
		editor,
	} ) => {
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'core/html',
			attributes: { content: '<p>First</p>\n<p>Second</p>' },
		} );
		const monacoEditor = getBlockEditor( editor );
		await expect( monacoEditor ).toBeVisible();

		// Place the cursor on the first line without a selection.
		await monacoEditor.locator( '.view-line' ).first().click();

		// Copy the current line and paste it at the end of the second line.
		// The trailing line break of the copied line is not always pasted.
		await page.keyboard.press( 'ControlOrMeta+c' );
		await setPosition( monacoEditor, 2, 14 );
		await page.keyboard.press( 'ControlOrMeta+v' );
		await expect
			.poll( () => getValue( monacoEditor ) )
			.toMatch( /^<p>First<\/p>\n<p>Second<\/p><p>First<\/p>\n?$/ );

		// Cut the first line.
		await setPosition( monacoEditor, 1, 1 );
		await page.keyboard.press( 'ControlOrMeta+x' );
		await expect
			.poll( () => getValue( monacoEditor ) )
			.toMatch( /^<p>Second<\/p><p>First<\/p>\n?$/ );

		// The block itself is neither copied nor cut.
		expect( await editor.getBlocks() ).toMatchObject( [ { name: 'core/html' } ] );
		expect( await editor.getBlocks() ).toHaveLength( 1 );
	} );

	test( 'copy and cut without a selection should do nothing when the option is disabled', async ( {
		admin,
		page,
		editor,
		requestUtils,
	} ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: {
				custom_html_block_extension_editor_options: { emptySelectionClipboard: false },
			},
		} );
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'core/html',
			attributes: { content: '<p>First</p>\n<p>Second</p>' },
		} );
		const monacoEditor = getBlockEditor( editor );
		await expect( monacoEditor ).toBeVisible();

		// Copy the second line with a selection so that the clipboard has known content.
		await monacoEditor.locator( '.view-line' ).nth( 1 ).click();
		await page.keyboard.press( 'Home' );
		await page.keyboard.press( 'Shift+End' );
		await page.keyboard.press( 'ControlOrMeta+c' );

		// Copy and cut on the first line without a selection.
		await monacoEditor.locator( '.view-line' ).first().click();
		await page.keyboard.press( 'ControlOrMeta+c' );
		await page.keyboard.press( 'ControlOrMeta+x' );

		// Neither changes the clipboard, so pasting inserts the second line.
		await page.keyboard.press( 'End' );
		await page.keyboard.press( 'ControlOrMeta+v' );
		await expect
			.poll( () => getValue( monacoEditor ) )
			.toBe( '<p>First</p><p>Second</p>\n<p>Second</p>' );

		// The block itself is neither copied nor cut.
		expect( await editor.getBlocks() ).toHaveLength( 1 );
	} );
} );
