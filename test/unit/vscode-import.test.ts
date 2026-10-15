/**
 * External dependencies
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';

/**
 * Internal dependencies
 */
import { importVSCodeSettings } from '../../src/admin/tools/components/vscode-import-tool/utils';
import type { EditorOptions, EditorSettings } from '../../src/types';

const editorSettings = {
	theme: 'vs-dark',
	insertSpaces: true,
	tabSize: 2,
	detectIndentation: false,
	emmet: true,
} as EditorSettings;

const editorOptions = {
	fontSize: 14,
	lineHeight: 21,
	fontFamily: 'Fira Code',
	fontWeight: '300',
	fontLigatures: false,
	quickSuggestions: { other: 'on', comments: 'off', strings: 'off' },
	hover: { enabled: 'on' },
	guides: { indentation: true },
	stickyScroll: { enabled: false },
	autoClosingBrackets: 'always',
	autoClosingQuotes: 'always',
	autoSurround: 'languageDefined',
	lineNumbers: 'on',
	cursorBlinking: 'blink',
	minimap: { autohide: 'none' },
} as EditorOptions;

const importSettings = ( settings: Record< string, unknown > ) =>
	importVSCodeSettings( JSON.stringify( settings ), editorSettings, editorOptions );

describe( 'importVSCodeSettings', () => {
	beforeAll( () => {
		vi.stubGlobal( 'window', {
			navigator: { platform: 'Win32' },
			chbeObj: {
				fontFamily: [
					{ name: 'Fira Code', weight: [ 300, 400, 500, 600, 700 ] },
					{ name: 'Ubuntu Mono', weight: [ 300, 700 ] },
					{ name: 'ACME, Mono', weight: [ 400 ] },
				],
			},
		} );
	} );

	it( 'imports a bundled theme by name', () => {
		expect( importSettings( { 'workbench.colorTheme': 'Monokai' } )?.editorSettings.theme ).toBe(
			'monokai'
		);
		expect(
			importSettings( { 'workbench.colorTheme': 'MagicWB (Amiga)' } )?.editorSettings.theme
		).toBe( 'magicwb-amiga' );
	} );

	it( 'maps the default VS Code themes to the built-in themes', () => {
		expect(
			importSettings( { 'workbench.colorTheme': 'Default Light Modern' } )?.editorSettings.theme
		).toBe( 'light' );
		expect( importSettings( { 'workbench.colorTheme': 'Dark+' } )?.editorSettings.theme ).toBe(
			'vs-dark'
		);
		expect(
			importSettings( { 'workbench.colorTheme': 'Dark (Visual Studio)' } )?.editorSettings.theme
		).toBe( 'vs-dark' );
		expect( importSettings( { 'workbench.colorTheme': 'Light 2026' } )?.editorSettings.theme ).toBe(
			'light'
		);
	} );

	it( 'uses the preferred dark theme when the color scheme is detected automatically', () => {
		const result = importSettings( {
			'window.autoDetectColorScheme': true,
			'workbench.colorTheme': 'Monokai',
			'workbench.preferredDarkColorTheme': 'Solarized Dark',
		} );
		expect( result?.editorSettings.theme ).toBe( 'solarized-dark' );
		expect( result?.importedCount ).toBe( 1 );
	} );

	it( 'skips a theme name inherited from Object.prototype', () => {
		const result = importSettings( { 'workbench.colorTheme': 'constructor' } );
		expect( result?.editorSettings.theme ).toBe( 'vs-dark' );
		expect( result?.importedCount ).toBe( 0 );
	} );

	it( 'skips an unknown theme', () => {
		const result = importSettings( { 'workbench.colorTheme': 'One Dark Pro' } );
		expect( result?.editorSettings.theme ).toBe( 'vs-dark' );
		expect( result?.importedCount ).toBe( 0 );
		expect( result?.skippedCount ).toBe( 1 );
	} );

	it( 'ignores theme and Emmet keys that are not VS Code settings', () => {
		const result = importSettings( { 'editor.theme': 'foo', 'editor.emmet': false } );
		expect( result?.editorSettings.theme ).toBe( 'vs-dark' );
		expect( result?.editorSettings.emmet ).toBe( true );
		expect( result?.importedCount ).toBe( 0 );
	} );

	it( 'turns Emmet off only when abbreviations are never shown', () => {
		expect(
			importSettings( { 'emmet.showExpandedAbbreviation': 'never' } )?.editorSettings.emmet
		).toBe( false );
		expect(
			importSettings( { 'emmet.showExpandedAbbreviation': 'always' } )?.editorSettings.emmet
		).toBe( true );
	} );

	it( 'turns ligatures on for a font feature settings string', () => {
		const result = importSettings( { 'editor.fontLigatures': "'ss01', 'cv02'" } );
		expect( result?.editorOptions.fontLigatures ).toBe( true );
		expect( result?.importedCount ).toBe( 1 );
	} );

	it( 'applies a boolean quick suggestions value to all token types', () => {
		const result = importSettings( { 'editor.quickSuggestions': false } );
		expect( result?.editorOptions.quickSuggestions ).toEqual( {
			other: 'off',
			comments: 'off',
			strings: 'off',
		} );
		expect( result?.importedCount ).toBe( 3 );
		expect( result?.skippedCount ).toBe( 0 );
	} );

	it( 'imports quick suggestions per token type', () => {
		const result = importSettings( {
			'editor.quickSuggestions': { other: 'inline', comments: 'on', strings: 'on' },
		} );
		expect( result?.editorOptions.quickSuggestions ).toEqual( {
			other: 'inline',
			comments: 'on',
			strings: 'on',
		} );
		expect( result?.importedCount ).toBe( 3 );
	} );

	it( 'converts settings from older VS Code versions', () => {
		const result = importSettings( {
			'editor.hover': false,
			'editor.renderIndentGuides': false,
			'editor.experimental.stickyScroll.enabled': true,
			'editor.autoClosingBrackets': false,
			'editor.autoSurround': 'quotes',
			'editor.lineNumbers': false,
			'editor.cursorBlinking': 'visible',
			'editor.minimap.autohide': true,
		} );
		expect( result?.editorOptions ).toMatchObject( {
			hover: { enabled: 'off' },
			guides: { indentation: false },
			stickyScroll: { enabled: true },
			autoClosingBrackets: 'never',
			autoClosingQuotes: 'never',
			autoSurround: 'quotes',
			lineNumbers: 'off',
			cursorBlinking: 'solid',
			minimap: { autohide: 'mouseover' },
		} );
		expect( result?.skippedCount ).toBe( 0 );
	} );

	it( 'keeps a renamed setting over its old name', () => {
		const result = importSettings( {
			'editor.renderIndentGuides': false,
			'editor.guides.indentation': true,
		} );
		expect( result?.editorOptions.guides.indentation ).toBe( true );
		expect( result?.importedCount ).toBe( 1 );
	} );

	it( 'imports a nested hover setting', () => {
		expect(
			importSettings( { 'editor.hover': { enabled: false } } )?.editorOptions.hover.enabled
		).toBe( 'off' );
	} );

	it( 'imports the first font of a font stack that is available', () => {
		const result = importSettings( {
			'editor.fontFamily': "Consolas, 'ubuntu mono', monospace",
		} );
		expect( result?.editorOptions.fontFamily ).toBe( 'Ubuntu Mono' );
		expect( importSettings( { 'editor.fontFamily': 'Consolas' } )?.skippedCount ).toBe( 1 );
	} );

	it( 'imports a font weight of the font', () => {
		expect( importSettings( { 'editor.fontWeight': 'normal' } )?.editorOptions.fontWeight ).toBe(
			'400'
		);
		const result = importSettings( {
			'editor.fontFamily': 'Ubuntu Mono',
			'editor.fontWeight': 'normal',
		} );
		expect( result?.editorOptions.fontWeight ).toBe( '300' );
		expect( result?.skippedCount ).toBe( 1 );
		expect(
			importSettings( { 'editor.fontFamily': 'Ubuntu Mono', 'editor.fontWeight': 'bold' } )
				?.editorOptions.fontWeight
		).toBe( '700' );
	} );

	it( 'matches quoted font names with commas and the generic monospace', () => {
		expect(
			importSettings( { 'editor.fontFamily': "'ACME, Mono', 'Fira Code'" } )?.editorOptions
				.fontFamily
		).toBe( 'ACME, Mono' );
		expect(
			importSettings( { 'editor.fontFamily': 'Consolas, monospace' } )?.editorOptions.fontFamily
		).toBe( 'monospace' );
	} );

	it( 'changes the current weight when the imported font does not have it', () => {
		const result = importVSCodeSettings(
			JSON.stringify( { 'editor.fontFamily': 'Ubuntu Mono' } ),
			editorSettings,
			{ ...editorOptions, fontWeight: '500' }
		);
		expect( result?.editorOptions.fontWeight ).toBe( '300' );
		expect(
			importSettings( { 'editor.fontFamily': "'ACME, Mono'" } )?.editorOptions.fontWeight
		).toBe( '400' );
		expect(
			importSettings( { 'editor.fontFamily': 'Ubuntu Mono' } )?.editorOptions.fontWeight
		).toBe( '300' );
	} );

	it( 'imports normal and bold weights for the generic monospace', () => {
		const result = importSettings( {
			'editor.fontFamily': 'monospace',
			'editor.fontWeight': 'bold',
		} );
		expect( result?.editorOptions.fontWeight ).toBe( '700' );
		expect( importSettings( { 'editor.fontFamily': 'monospace' } )?.editorOptions.fontWeight ).toBe(
			'400'
		);
	} );

	it( 'converts an automatic or relative line height to pixels', () => {
		const lineHeightOf = ( settings: Record< string, unknown > ) =>
			importSettings( settings )?.editorOptions.lineHeight;
		expect( lineHeightOf( { 'editor.lineHeight': 24 } ) ).toBe( 24 );
		expect( lineHeightOf( { 'editor.lineHeight': 1.5, 'editor.fontSize': 16 } ) ).toBe( 24 );
		expect( lineHeightOf( { 'editor.lineHeight': 0, 'editor.fontSize': 20 } ) ).toBe( 27 );
		// VS Code's default font size on Windows and Linux is 14.
		expect( lineHeightOf( { 'editor.lineHeight': 2 } ) ).toBe( 28 );
		expect( lineHeightOf( { 'editor.lineHeight': 0.5 } ) ).toBe( 8 );
		expect( lineHeightOf( { 'editor.lineHeight': 1.5, 'editor.fontSize': 0 } ) ).toBe( 21 );
	} );

	it( 'applies grouped overrides that include HTML before the HTML override', () => {
		const result = importSettings( {
			'editor.fontSize': 20,
			'[ html ][css]': { 'editor.fontSize': 18, 'editor.tabSize': 3 },
			'[css][js]': { 'editor.tabSize': 8 },
			'[ html ]': { 'editor.fontSize': 16 },
		} );
		expect( result?.editorOptions.fontSize ).toBe( 16 );
		expect( result?.editorSettings.tabSize ).toBe( 3 );
	} );

	it( 'converts each scope before applying the HTML override', () => {
		const result = importSettings( {
			'editor.quickSuggestions': false,
			'editor.hover.enabled': 'on',
			'[html]': {
				'editor.quickSuggestions': { comments: 'on' },
				'editor.hover': false,
			},
		} );
		expect( result?.editorOptions.quickSuggestions ).toEqual( {
			other: 'off',
			comments: 'on',
			strings: 'off',
		} );
		expect( result?.editorOptions.hover.enabled ).toBe( 'off' );
	} );

	it( 'prefers HTML-specific settings and ignores other languages', () => {
		const result = importSettings( {
			'editor.fontSize': 20,
			'editor.tabSize': 4,
			'[html]': { 'editor.fontSize': 16, 'editor.hover': { enabled: false } },
			'[css]': { 'editor.tabSize': 8 },
		} );
		expect( result?.editorOptions.fontSize ).toBe( 16 );
		expect( result?.editorOptions.hover.enabled ).toBe( 'off' );
		expect( result?.editorSettings.tabSize ).toBe( 4 );
		expect( result?.importedCount ).toBe( 3 );
	} );
} );
