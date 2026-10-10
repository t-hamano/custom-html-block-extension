/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Settings page', () => {
	test( 'should be rendered', async ( { admin, page } ) => {
		// Hide welcome guide.
		const welcomeGuide = page.getByRole( 'dialog', {
			name: 'About Custom HTML Block Extension',
		} );
		await page.addLocatorHandler( welcomeGuide, async () => {
			await welcomeGuide.getByRole( 'button', { name: 'Close' } ).click();
		} );
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );

		// Editsor config tab
		await expect( page.getByRole( 'button', { name: 'Save settings' } ) ).toBeVisible();
		// Tools tab
		await page.getByRole( 'tab', { name: 'Tools' } ).click();
		await expect( page.getByRole( 'button', { name: 'Export', exact: true } ) ).toBeVisible();
		// Options tab
		await page.getByRole( 'tab', { name: 'Options' } ).click();
		await expect( page.getByRole( 'button', { name: 'Save Options' } ) ).toBeVisible();
	} );

	test( 'tab focus mode should move focus out of the code editor', async ( { admin, page } ) => {
		// Hide welcome guide.
		const welcomeGuide = page.getByRole( 'dialog', {
			name: 'About Custom HTML Block Extension',
		} );
		await page.addLocatorHandler( welcomeGuide, async () => {
			await welcomeGuide.getByRole( 'button', { name: 'Close' } ).click();
		} );
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );

		const editor = page.locator( '.chbe-admin-editor-config-editor-preview .monaco-editor' );
		const textbox = editor.getByRole( 'textbox', {
			name: /^Editor content\. To change the Tab key behavior, press Ctrl\+(Shift\+)?M\.$/,
		} );

		await editor.click();
		await expect( textbox ).toBeFocused();

		// While tab focus mode is disabled, Tab stays inside the editor.
		await page.keyboard.press( 'Tab' );
		await expect( textbox ).toBeFocused();

		// The plugin picks the combo from navigator.platform (isAppleOS), while
		// Monaco maps Ctrl/Cmd from navigator.userAgent ("Macintosh" => Meta).
		const shortcut = await page.evaluate( () => {
			const { platform, userAgent } = window.navigator;
			const isAppleOS =
				platform.indexOf( 'Mac' ) !== -1 || [ 'iPad', 'iPhone' ].includes( platform );
			if ( isAppleOS ) {
				return 'Control+Shift+m';
			}
			return userAgent.includes( 'Macintosh' ) ? 'Meta+m' : 'Control+m';
		} );

		// Toggle tab focus mode.
		await page.keyboard.press( shortcut );

		// The change should be announced to screen readers.
		await expect( page.getByRole( 'button', { name: 'Dismiss this notice' } ) ).toContainText(
			'Pressing Tab will now move focus to the next focusable element.'
		);

		// Tab should move focus out of the editor to the Save settings button.
		await page.keyboard.press( 'Tab' );
		await expect( page.getByRole( 'button', { name: 'Save settings' } ) ).toBeFocused();
	} );
} );
