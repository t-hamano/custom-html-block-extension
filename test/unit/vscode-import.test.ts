/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

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
	fontLigatures: false,
	quickSuggestions: { other: 'on', comments: 'off', strings: 'off' },
} as EditorOptions;

const importSettings = ( settings: Record< string, unknown > ) =>
	importVSCodeSettings( JSON.stringify( settings ), editorSettings, editorOptions );

describe( 'importVSCodeSettings', () => {
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
		expect( result?.importedCount ).toBe( 1 );
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
} );
