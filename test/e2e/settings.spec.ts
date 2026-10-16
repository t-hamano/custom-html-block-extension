/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const EDITOR_SETTINGS = 'custom_html_block_extension_editor_settings';
const EDITOR_OPTIONS = 'custom_html_block_extension_editor_options';
const OPTIONS = 'custom_html_block_extension_options';

test.describe( 'Settings page', () => {
	test( 'should be rendered', async ( { admin, page } ) => {
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

	test( 'should enable the save button only when there are unsaved changes', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );

		const saveButton = page.getByRole( 'button', { name: 'Save settings' } );
		await expect( saveButton ).toBeDisabled();

		// Changing a setting enables the button, and reverting it disables it again.
		await page.getByRole( 'radio', { name: 'Tab', exact: true } ).click();
		await expect( saveButton ).toBeEnabled();
		await page.getByRole( 'radio', { name: 'Space', exact: true } ).click();
		await expect( saveButton ).toBeDisabled();

		// Saving the changed setting disables the button.
		await page.getByRole( 'radio', { name: 'Tab', exact: true } ).click();
		await saveButton.click();
		await expect( page.getByRole( 'button', { name: 'Dismiss this notice' } ) ).toContainText(
			'Settings saved.'
		);
		await expect( saveButton ).toBeDisabled();

		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { [ EDITOR_SETTINGS ]: null, [ EDITOR_OPTIONS ]: null },
		} );
	} );

	test( 'tab focus mode should move focus out of the code editor', async ( { admin, page } ) => {
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

test.describe( 'Settings REST API', () => {
	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { [ EDITOR_SETTINGS ]: null, [ EDITOR_OPTIONS ]: null },
		} );
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { [ OPTIONS ]: null },
		} );
	} );

	test( 'should reject an invalid editor config', async ( { requestUtils } ) => {
		await expect(
			requestUtils.rest( {
				method: 'POST',
				path: '/wp/v2/settings',
				data: { [ EDITOR_SETTINGS ]: { tabSize: 'abc' } },
			} )
		).rejects.toMatchObject( { code: 'rest_invalid_param' } );

		await expect(
			requestUtils.rest( {
				method: 'POST',
				path: '/wp/v2/settings',
				data: { [ EDITOR_OPTIONS ]: { fontSize: 'abc' } },
			} )
		).rejects.toMatchObject( { code: 'rest_invalid_param' } );
	} );

	test( 'should reject legacy editor options', async ( { requestUtils } ) => {
		// The settings UI only sends values of the current schema. Files exported
		// by older versions are migrated by the import instead.
		await expect(
			requestUtils.rest( {
				method: 'POST',
				path: '/wp/v2/settings',
				data: { [ EDITOR_OPTIONS ]: { hover: false } },
			} )
		).rejects.toMatchObject( { code: 'rest_invalid_param' } );
	} );

	test( 'should remove unknown properties', async ( { requestUtils } ) => {
		const response = await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: {
				[ EDITOR_SETTINGS ]: { tabSize: 4, unknownSetting: true },
				[ EDITOR_OPTIONS ]: {
					// `localityBonus` is not in the schema.
					suggest: { insertMode: 'replace', localityBonus: true },
				},
			},
		} );

		expect( response[ EDITOR_SETTINGS ] ).toMatchObject( { tabSize: 4, theme: 'vs-dark' } );
		expect( response[ EDITOR_SETTINGS ] ).not.toHaveProperty( 'unknownSetting' );
		expect( response[ EDITOR_OPTIONS ].suggest ).toMatchObject( { insertMode: 'replace' } );
		expect( response[ EDITOR_OPTIONS ].suggest ).not.toHaveProperty( 'localityBonus' );
	} );

	test( 'should save guides options that mix booleans and strings', async ( { requestUtils } ) => {
		const guides = {
			bracketPairs: 'active',
			bracketPairsHorizontal: false,
			highlightActiveBracketPair: false,
			highlightActiveIndentation: 'always',
			indentation: true,
		};

		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { [ EDITOR_OPTIONS ]: { guides } },
		} );

		const response = await requestUtils.rest( {
			method: 'GET',
			path: '/wp/v2/settings',
		} );
		expect( response[ EDITOR_OPTIONS ].guides ).toEqual( guides );
	} );

	test( 'should reject invalid options', async ( { requestUtils } ) => {
		await expect(
			requestUtils.rest( {
				method: 'POST',
				path: '/wp/v2/settings',
				data: { [ OPTIONS ]: { permissionBlockEditor: 'abc' } },
			} )
		).rejects.toMatchObject( { code: 'rest_invalid_param' } );
	} );
} );

test.describe( 'Editor config', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin( 'classic-editor' );
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { [ EDITOR_SETTINGS ]: null, [ EDITOR_OPTIONS ]: null },
		} );
	} );

	test( 'saved editor settings should be applied to the code editor', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );

		await page.getByRole( 'spinbutton', { name: 'Indent width' } ).fill( '4' );
		await page.getByRole( 'combobox', { name: 'Theme' } ).click();
		await page.getByRole( 'option', { name: 'GitHub', exact: true } ).click();
		await page.getByRole( 'button', { name: 'Save settings' } ).click();
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'Settings saved.' } )
		).toBeVisible();

		await admin.createNewPost();
		await editor.insertBlock( { name: 'core/html' } );
		const monacoEditor = editor.canvas.locator( '[data-type="core/html"] .monaco-editor' );
		await expect( monacoEditor ).toBeVisible();

		const tabSize = await monacoEditor.evaluate(
			( element ) =>
				element.ownerDocument.defaultView?.monaco?.editor
					.getEditors()
					.find( ( instance ) => instance.getDomNode() === element )
					?.getModel()
					?.getOptions().tabSize
		);
		expect( tabSize ).toBe( 4 );

		// The GitHub theme is based on the light (`vs`) theme.
		await expect( monacoEditor ).toHaveClass( /(^|\s)vs(\s|$)/ );
	} );

	test( 'reset should restore the default editor config', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { [ EDITOR_SETTINGS ]: { tabSize: 4 }, [ EDITOR_OPTIONS ]: { fontSize: 20 } },
		} );
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );

		const tabSize = page.getByRole( 'spinbutton', { name: 'Indent width' } );
		await expect( tabSize ).toHaveValue( '4' );

		// The range controls also have "Reset" buttons, so pick the one opening the dialog.
		await page
			.getByRole( 'button', { name: 'Reset', exact: true } )
			.and( page.locator( '[aria-haspopup="dialog"]' ) )
			.click();
		await page.getByRole( 'button', { name: 'Reset settings' } ).click();
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'Settings have been reset.' } )
		).toBeVisible();
		await expect( tabSize ).toHaveValue( '2' );

		const response = await requestUtils.rest( { path: '/wp/v2/settings' } );
		expect( response[ EDITOR_SETTINGS ] ).toMatchObject( { tabSize: 2 } );
		expect( response[ EDITOR_OPTIONS ] ).toMatchObject( { fontSize: 14 } );
	} );

	test( 'exported editor config should be restored by importing it', async ( {
		admin,
		page,
		requestUtils,
	}, testInfo ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { [ EDITOR_SETTINGS ]: { tabSize: 4 }, [ EDITOR_OPTIONS ]: { fontSize: 20 } },
		} );
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );
		await page.getByRole( 'tab', { name: 'Tools' } ).click();

		const downloadPromise = page.waitForEvent( 'download' );
		await page.getByRole( 'button', { name: 'Export', exact: true } ).click();
		const download = await downloadPromise;
		expect( download.suggestedFilename() ).toMatch( /^chbe-export-\d{4}-\d{2}-\d{2}\.json$/ );

		const exportedFile = testInfo.outputPath( download.suggestedFilename() );
		await download.saveAs( exportedFile );

		// Reset the editor config, then import the exported file.
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: { [ EDITOR_SETTINGS ]: null, [ EDITOR_OPTIONS ]: null },
		} );
		await page.reload();
		await page.getByRole( 'tab', { name: 'Tools' } ).click();
		await page.locator( 'input[type="file"][accept=".json"]' ).setInputFiles( exportedFile );

		// The uploaded file should be loaded into the text area. It should be in
		// the settings.json format, pretty-printed with tab indentation.
		const textarea = page.getByRole( 'textbox', { name: 'Settings (JSON)' } );
		await expect( textarea ).not.toHaveValue( '' );
		const exportedJson = await textarea.inputValue();
		expect( exportedJson ).toMatch( /^{\n\t"customHtmlBlockExtension\.theme": / );
		expect( JSON.parse( exportedJson ) ).toMatchObject( {
			'editor.tabSize': 4,
			'editor.fontSize': 20,
		} );
		await page.getByRole( 'button', { name: 'Import', exact: true } ).click();
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'Check the preview and save the changes.' } )
		).toBeVisible();

		// The import applies unsaved changes.
		await page.getByRole( 'tab', { name: 'Editor config' } ).click();
		await page.getByRole( 'button', { name: 'Save settings' } ).click();
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'Settings saved.' } )
		).toBeVisible();

		const response = await requestUtils.rest( { path: '/wp/v2/settings' } );
		expect( response[ EDITOR_SETTINGS ] ).toMatchObject( { tabSize: 4 } );
		expect( response[ EDITOR_OPTIONS ] ).toMatchObject( { fontSize: 20 } );
	} );

	test( 'VS Code settings should be imported as unsaved changes', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );
		await page.getByRole( 'tab', { name: 'Tools' } ).click();

		await page.getByRole( 'textbox', { name: 'Settings (JSON)' } ).fill( `{
	// Comments and trailing commas are allowed.
	"editor.fontSize": 20,
	"editor.minimap": { "enabled": false },
	"editor.tabSize": 4,
	"editor.rulers": [ 80 ],
	// A value of a different type is skipped.
	"editor.cursorStyle": 3,
	// An option that needs a conversion is skipped.
	"editor.fontFamily": "Consolas",
	// A theme is imported when its name matches a theme.
	"workbench.colorTheme": "Monokai",
	// HTML-specific settings take priority over the global ones.
	"[html]": { "editor.fontSize": 30 },
	// Other language-specific settings and other settings are ignored.
	"[css]": { "editor.tabSize": 8 },
	"workbench.startupEditor": "none",
}` );
		await page.getByRole( 'button', { name: 'Import', exact: true } ).click();
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'Imported 5 settings and skipped 2 settings.' } )
		).toBeVisible();

		// The import stays on the tools tab and doesn't save the settings.
		await expect( page.getByRole( 'tab', { name: 'Tools' } ) ).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await page.getByRole( 'tab', { name: 'Editor config' } ).click();
		await expect( page.getByRole( 'spinbutton', { name: 'Indent width' } ) ).toHaveValue( '4' );
		let response = await requestUtils.rest( { path: '/wp/v2/settings' } );
		expect( response[ EDITOR_SETTINGS ] ).toMatchObject( { tabSize: 2 } );

		await page.getByRole( 'button', { name: 'Save settings' } ).click();
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'Settings saved.' } )
		).toBeVisible();

		response = await requestUtils.rest( { path: '/wp/v2/settings' } );
		expect( response[ EDITOR_SETTINGS ] ).toMatchObject( { tabSize: 4, theme: 'monokai' } );
		expect( response[ EDITOR_OPTIONS ] ).toMatchObject( {
			fontSize: 30,
			minimap: { enabled: false },
			rulers: [ 80 ],
			cursorStyle: 'line',
			fontFamily: 'Fira Code',
		} );
	} );

	test( 'importing invalid VS Code settings should show an error notice', async ( {
		admin,
		page,
	} ) => {
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );
		await page.getByRole( 'tab', { name: 'Tools' } ).click();

		const textbox = page.getByRole( 'textbox', { name: 'Settings (JSON)' } );
		const importButton = page.getByRole( 'button', { name: 'Import', exact: true } );

		await textbox.fill( '{ "editor.fontSize": ' );
		await importButton.click();
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'The format of the settings is not correct.' } )
		).toBeVisible();

		await textbox.fill( '{ "workbench.colorTheme": "One Dark Pro" }' );
		await importButton.click();
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'No supported settings were found.' } )
		).toBeVisible();
		await expect( page.getByRole( 'tab', { name: 'Tools' } ) ).toHaveAttribute(
			'aria-selected',
			'true'
		);
	} );

	test( 'uploading a VS Code settings file should fill in the settings', async ( {
		admin,
		page,
	} ) => {
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );
		await page.getByRole( 'tab', { name: 'Tools' } ).click();

		const fileInput = page.locator( 'input[type="file"][accept=".json"]' );
		const textbox = page.getByRole( 'textbox', { name: 'Settings (JSON)' } );

		await fileInput.setInputFiles( 'readme.txt' );
		await expect(
			page
				.getByRole( 'button', { name: 'Dismiss this notice' } )
				.filter( { hasText: 'It is not a JSON file.' } )
		).toBeVisible();
		await expect( textbox ).toHaveValue( '' );

		await fileInput.setInputFiles( 'package.json' );
		await expect( textbox ).toHaveValue( /"name": "custom-html-block-extension"/ );
	} );
} );

test.describe( 'Editor preview', () => {
	const PREVIEW_EDITOR = '.chbe-admin-editor-config-editor-preview .monaco-editor';

	test( 'changing the theme should update the preview', async ( { admin, page } ) => {
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );
		const previewEditor = page.locator( PREVIEW_EDITOR );

		// The default theme is based on the dark (`vs-dark`) theme.
		await expect( previewEditor ).toHaveClass( /(^|\s)vs-dark(\s|$)/ );
		const getBackgroundColor = () =>
			previewEditor.evaluate( ( element ) => window.getComputedStyle( element ).backgroundColor );
		const initialBackgroundColor = await getBackgroundColor();

		await page.getByRole( 'combobox', { name: 'Theme' } ).click();
		await page.getByRole( 'option', { name: 'GitHub', exact: true } ).click();

		// The GitHub theme is based on the light (`vs`) theme.
		await expect( previewEditor ).toHaveClass( /(^|\s)vs(\s|$)/ );
		await expect.poll( getBackgroundColor ).not.toBe( initialBackgroundColor );
	} );

	test( 'changing the font family should update the preview', async ( { admin, page } ) => {
		await admin.visitAdminPage( 'options-general.php?page=custom-html-block-extension' );
		const previewEditor = page.locator( PREVIEW_EDITOR );
		await expect( previewEditor ).toBeVisible();

		const getFontFamily = () =>
			previewEditor
				.locator( '.view-lines' )
				.evaluate( ( element ) => window.getComputedStyle( element ).fontFamily );
		await expect.poll( getFontFamily ).toContain( 'Fira Code' );

		await page.getByRole( 'combobox', { name: 'Font family' } ).click();
		await page.getByRole( 'option', { name: 'Source Code Pro', exact: true } ).click();

		// The font is loaded and kept in the preview, without falling back to the default font.
		await expect( page.locator( 'link[href*="source-code-pro.css"]' ) ).toHaveCount( 1 );
		await expect
			.poll( () =>
				page.evaluate( () =>
					[ ...document.fonts ].some(
						( fontFace ) =>
							fontFace.family.replace( /"/g, '' ) === 'Source Code Pro' &&
							fontFace.status === 'loaded'
					)
				)
			)
			.toBe( true );
		await expect.poll( getFontFamily ).toContain( 'Source Code Pro' );
		await expect( page.getByText( /Failed to load the font/ ) ).toHaveCount( 0 );
	} );
} );
