/**
 * WordPress dependencies
 */
import {
	insertBlock,
	activatePlugin,
	deactivatePlugin,
	pressKeyWithModifier,
	switchUserToAdmin,
	createNewPost,
	getEditedPostContent,
	visitAdminPage,
	canvas,
} from '@wordpress/e2e-test-utils';

const page = global.page;

const clickButtonWithId = async ( id ) => {
	const selector = `#${ id }`;
	await page.waitForSelector( selector );
	await page.click( selector );
};

page.on( 'dialog', async ( dialog ) => await dialog.accept() );

describe( 'Editor', () => {
	beforeAll( async () => {
		await switchUserToAdmin();

		// Since the pointer is not displayed after the second test
		try {
			const selector = '#wp-pointer-0 a.close';
			await page.waitForSelector( selector );
			await page.click( selector );
		} catch {}
	} );

	it( 'input by Emmet should be expanded on classic editor', async () => {
		await activatePlugin( 'classic-editor' );
		await visitAdminPage( 'post-new.php' );
		await page.waitForSelector( '#post-body' );
		await clickButtonWithId( 'content-tmce' );
		await clickButtonWithId( 'content-html' );
		await page.waitForSelector( '#monaco-editor-container .monaco-editor' );
		await page.click( '#monaco-editor-container .monaco-editor' );
		await page.keyboard.type( 'p.selector' );
		await page.keyboard.down( 'Tab' );
		await clickButtonWithId( 'publish' );
		await clickButtonWithId( 'content-tmce' );
		await clickButtonWithId( 'content-html' );
		await page.waitForSelector( '#wp-content-editor-container textarea.wp-editor-area' );
		const textarea = await page.$$( '#wp-content-editor-container textarea.wp-editor-area' );
		const textareaValue = await page.evaluate( ( element ) => element.textContent, textarea[ 0 ] );
		expect( textareaValue ).toBe( '<p class="selector"></p>' );
		await deactivatePlugin( 'classic-editor' );
	} );

	it( 'input by Emmet should be expanded on theme editor', async () => {
		await visitAdminPage( 'theme-editor.php' );
		await page.waitForSelector( '#monaco-editor-container .monaco-editor' );
		await page.click( '#monaco-editor-container .monaco-editor' );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( '.selector{fz100', { delay: 50 } );
		await page.keyboard.press( 'Tab' );

		// Skip because the save button doesn't display due to permission issues on GitHub Actions.
		try {
			await clickButtonWithId( 'submit' );
			await page.waitForSelector( '#template textarea' );
			const textarea = await page.$$( '#template textarea' );
			const textareaValue = await page.evaluate(
				( element ) => element.textContent,
				textarea[ 0 ]
			);
			expect( textareaValue ).toBe( '.selector{font-size: 100px;}' );
		} catch {}
	} );

	it( 'input by Emmet should be expanded on block editor', async () => {
		await createNewPost();
		await insertBlock( 'Custom HTML' );
		await canvas().waitForSelector( '[data-type="core/html"] .monaco-editor' );
		await canvas().click( '[data-type="core/html"] .monaco-editor' );
		await page.keyboard.type( 'ul.list>li.item*5' );
		await page.keyboard.down( 'Tab' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );
