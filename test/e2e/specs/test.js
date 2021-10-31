/**
 * WordPress dependencies
 */
import {
	insertBlock,
	installPlugin,
	activatePlugin,
	deactivatePlugin,
	uninstallPlugin,
	pressKeyWithModifier,
	switchUserToAdmin,
	createNewPost,
	getEditedPostContent,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	dismissPointer,
	clickButtonWithId,
	createNewClassicPost,
	clickAdminTopMenuWithText,
	expandAdminMenu,
	clickAdminSubMenuWithText,
} from '../helper';

const page = global.page;

page.on( 'dialog', async ( dialog ) => await dialog.accept() );

describe( 'Editor', () => {
	beforeAll( async () => {
		await switchUserToAdmin();
		await dismissPointer();
	} );

	it( 'Input by Emmet should be expanded on classic editor', async () => {
		await installPlugin( 'classic-editor' );
		await activatePlugin( 'classic-editor' );
		await createNewClassicPost();
		await clickButtonWithId( 'content-tmce' );
		await clickButtonWithId( 'content-html' );
		await page.waitForSelector( '#monaco-editor-container .monaco-editor' );
		await page.click( '#monaco-editor-container .monaco-editor' );
		await page.keyboard.type( 'p.selector' );
		await page.keyboard.down( 'Tab' );
		await page.waitForTimeout( 500 );
		await clickButtonWithId( 'publish' );
		await clickButtonWithId( 'content-tmce' );
		await clickButtonWithId( 'content-html' );
		await page.waitForSelector( '#wp-content-editor-container textarea.wp-editor-area' );
		await page.waitForTimeout( 1000 );
		const textarea = await page.$$( '#wp-content-editor-container textarea.wp-editor-area' );
		const textareaValue = await page.evaluate( ( element ) => element.textContent, textarea[ 0 ] );
		expect( textareaValue ).toBe( '<p class="selector"></p>' );
		await deactivatePlugin( 'classic-editor' );
		await uninstallPlugin( 'classic-editor' );
	} );

	it( 'Input by Emmet should be expanded on theme editor', async () => {
		await clickAdminTopMenuWithText( 'Appearance' );
		await expandAdminMenu();
		await clickAdminSubMenuWithText( 'Theme Editor' );
		await page.waitForSelector( '#monaco-editor-container .monaco-editor' );
		await page.click( '#monaco-editor-container .monaco-editor' );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( '.selector{fz100', { delay: 50 } );
		await page.keyboard.press( 'Tab' );
		await page.waitForTimeout( 500 );
		await clickButtonWithId( 'submit' );
		await page.waitForSelector( '#monaco-editor-container .monaco-editor' );
		await page.waitForSelector( '#template textarea' );
		const textarea = await page.$$( '#template textarea' );
		const textareaValue = await page.evaluate( ( element ) => element.textContent, textarea[ 0 ] );
		expect( textareaValue ).toBe( '.selector{font-size: 100px;}' );
	} );

	it( 'Input by Emmet should be expanded on block editor', async () => {
		await createNewPost();
		await insertBlock( 'Custom HTML' );
		await page.waitForSelector( '[data-type="core/html"] .monaco-editor' );
		await page.click( '[data-type="core/html"] .monaco-editor' );
		await page.keyboard.type( 'ul.list>li.item*5' );
		await page.keyboard.down( 'Tab' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );
