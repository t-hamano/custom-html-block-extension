/**
 * External dependencies
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';

/**
 * Internal dependencies
 */
import {
	buildEditorConfig,
	countEditorConfig,
	exportEditorConfig,
	getImportItems,
	getUnchangedImportItems,
	isClampedItem,
	mergeEditorOptions,
	parseEditorConfig,
} from '../../src/admin/tools/utils';
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
	occurrencesHighlight: 'off',
} as EditorOptions;

// The editor config sent to the server, as JSON encodes it.
const parseSettings = (
	settings: Record< string, unknown >,
	currentEditorOptions: EditorOptions = editorOptions
) => {
	const payload = parseEditorConfig( JSON.stringify( settings ), currentEditorOptions );
	return payload && JSON.parse( JSON.stringify( payload ) );
};
const settingsOf = ( settings: Record< string, unknown > ) =>
	parseSettings( settings )?.editorSettings;
const optionsOf = ( settings: Record< string, unknown > ) =>
	parseSettings( settings )?.editorOptions;

describe( 'parseEditorConfig', () => {
	beforeAll( () => {
		vi.stubGlobal( 'window', {
			navigator: { platform: 'Win32' },
			chbeObj: {
				fontFamily: [
					{ name: 'Fira Code', weight: [ 300, 400, 500, 600, 700 ] },
					{ name: 'Ubuntu Mono', weight: [ 300, 700 ] },
					{ name: 'ACME, Mono', weight: [ 400 ] },
					{ name: "Writer's, Mono", weight: [ 400 ] },
					{ name: 'No Weights' },
				],
			},
		} );
	} );

	it( 'returns null for text that is not a JSON object', () => {
		expect( parseEditorConfig( '{ "editor.fontSize": ', editorOptions ) ).toBeNull();
		expect( parseEditorConfig( '[]', editorOptions ) ).toBeNull();
	} );

	it( 'nests the editor settings and options by option path', () => {
		expect(
			parseSettings( {
				'editor.tabSize': 4,
				'editor.fontSize': 20,
				'editor.minimap.enabled': false,
				'editor.minimap': { side: 'left' },
				'editor.rulers': [ 80 ],
				'workbench.startupEditor': 'none',
			} )
		).toEqual( {
			editorSettings: { tabSize: 4 },
			editorOptions: { fontSize: 20, minimap: { enabled: false, side: 'left' }, rulers: [ 80 ] },
		} );
	} );

	it( 'sends unsupported settings for the server to skip', () => {
		expect( optionsOf( { 'editor.formatOnSave': true, 'editor.cursorStyle': 3 } ) ).toEqual( {
			formatOnSave: true,
			cursorStyle: 3,
		} );
	} );

	it( 'sets a __proto__ key as a property', () => {
		const result = optionsOf( { 'editor.__proto__.polluted': true } );
		expect( Object.keys( result ) ).toEqual( [ '__proto__' ] );
		expect( ( {} as Record< string, unknown > ).polluted ).toBeUndefined();
	} );

	it( 'imports a bundled theme by name', () => {
		expect( settingsOf( { 'workbench.colorTheme': 'Monokai' } ) ).toEqual( { theme: 'monokai' } );
		expect( settingsOf( { 'workbench.colorTheme': 'MagicWB (Amiga)' } ) ).toEqual( {
			theme: 'magicwb-amiga',
		} );
	} );

	it( 'maps the default VS Code themes to the built-in themes', () => {
		expect( settingsOf( { 'workbench.colorTheme': 'Default Light Modern' } )?.theme ).toBe(
			'light'
		);
		expect( settingsOf( { 'workbench.colorTheme': 'Dark+' } )?.theme ).toBe( 'vs-dark' );
		expect( settingsOf( { 'workbench.colorTheme': 'Dark (Visual Studio)' } )?.theme ).toBe(
			'vs-dark'
		);
		expect( settingsOf( { 'workbench.colorTheme': 'Light 2026' } )?.theme ).toBe( 'light' );
	} );

	it( 'uses the preferred dark theme when the color scheme is detected automatically', () => {
		expect(
			settingsOf( {
				'window.autoDetectColorScheme': true,
				'workbench.colorTheme': 'Monokai',
				'workbench.preferredDarkColorTheme': 'Solarized Dark',
			} )
		).toEqual( { theme: 'solarized-dark' } );
	} );

	it( 'sends null for an unknown theme, so that it is skipped', () => {
		expect( settingsOf( { 'workbench.colorTheme': 'constructor' } ) ).toEqual( { theme: null } );
		expect( settingsOf( { 'workbench.colorTheme': 'One Dark Pro' } ) ).toEqual( { theme: null } );
	} );

	it( 'ignores theme and Emmet keys that are not VS Code settings', () => {
		expect( parseSettings( { 'editor.theme': 'foo', 'editor.emmet': false } ) ).toEqual( {
			editorSettings: {},
			editorOptions: {},
		} );
	} );

	it( 'turns Emmet off only when abbreviations are never shown', () => {
		expect( settingsOf( { 'emmet.showExpandedAbbreviation': 'never' } ) ).toEqual( {
			emmet: false,
		} );
		expect( settingsOf( { 'emmet.showExpandedAbbreviation': 'always' } ) ).toEqual( {
			emmet: true,
		} );
	} );

	it( 'turns ligatures on for a font feature settings string', () => {
		expect( optionsOf( { 'editor.fontLigatures': "'ss01', 'cv02'" } ) ).toEqual( {
			fontLigatures: true,
		} );
	} );

	it( 'applies a boolean quick suggestions value to all token types', () => {
		expect( optionsOf( { 'editor.quickSuggestions': false } ) ).toEqual( {
			quickSuggestions: { other: 'off', comments: 'off', strings: 'off' },
		} );
	} );

	it( 'converts settings from older VS Code versions', () => {
		expect(
			optionsOf( {
				'editor.hover': false,
				'editor.renderIndentGuides': false,
				'editor.experimental.stickyScroll.enabled': true,
				'editor.autoClosingBrackets': false,
				'editor.autoSurround': 'quotes',
				'editor.lineNumbers': false,
				'editor.cursorBlinking': 'visible',
				'editor.minimap.autohide': true,
			} )
		).toEqual( {
			hover: { enabled: false },
			guides: { indentation: false },
			stickyScroll: { enabled: true },
			autoClosingBrackets: 'never',
			autoClosingQuotes: 'never',
			autoSurround: 'quotes',
			lineNumbers: 'off',
			cursorBlinking: 'solid',
			minimap: { autohide: 'mouseover' },
		} );
	} );

	it( 'keeps a renamed setting over its old name', () => {
		expect(
			optionsOf( {
				'editor.renderIndentGuides': false,
				'editor.guides.indentation': true,
			} )
		).toEqual( { guides: { indentation: true } } );
	} );

	it( 'imports the first font of a font stack that is available', () => {
		expect( optionsOf( { 'editor.fontFamily': "Consolas, 'ubuntu mono', monospace" } ) ).toEqual( {
			fontFamily: 'Ubuntu Mono',
		} );
		expect( optionsOf( { 'editor.fontFamily': 'Consolas' } ) ).toEqual( { fontFamily: null } );
	} );

	it( 'imports a font weight of the font', () => {
		expect( optionsOf( { 'editor.fontWeight': 'normal' } ) ).toEqual( { fontWeight: '400' } );
		expect(
			optionsOf( { 'editor.fontFamily': 'Ubuntu Mono', 'editor.fontWeight': 'normal' } )
		).toEqual( { fontFamily: 'Ubuntu Mono', fontWeight: null } );
		expect(
			optionsOf( { 'editor.fontFamily': 'Ubuntu Mono', 'editor.fontWeight': 'bold' } )
		).toEqual( { fontFamily: 'Ubuntu Mono', fontWeight: '700' } );
	} );

	it( 'matches quoted font names with commas and the generic monospace', () => {
		expect( optionsOf( { 'editor.fontFamily': "'ACME, Mono', 'Fira Code'" } )?.fontFamily ).toBe(
			'ACME, Mono'
		);
		expect( optionsOf( { 'editor.fontFamily': 'Consolas, monospace' } )?.fontFamily ).toBe(
			'monospace'
		);
	} );

	it( 'changes the current weight when the imported font does not have it', () => {
		expect(
			parseSettings(
				{ 'editor.fontFamily': 'Ubuntu Mono' },
				{ ...editorOptions, fontWeight: '500' }
			)?.editorOptions.fontWeight
		).toBe( '300' );
		expect( optionsOf( { 'editor.fontFamily': "'ACME, Mono'" } )?.fontWeight ).toBe( '400' );
		expect( optionsOf( { 'editor.fontFamily': 'Fira Code' } )?.fontWeight ).toBeUndefined();
	} );

	it( 'imports normal and bold weights for the generic monospace', () => {
		expect(
			optionsOf( { 'editor.fontFamily': 'monospace', 'editor.fontWeight': 'bold' } )?.fontWeight
		).toBe( '700' );
		expect( optionsOf( { 'editor.fontFamily': 'monospace' } )?.fontWeight ).toBe( '400' );
	} );

	it( 'imports any weight of a font registered without weights', () => {
		expect(
			optionsOf( { 'editor.fontFamily': 'No Weights', 'editor.fontWeight': '600' } )
		).toEqual( { fontFamily: 'No Weights', fontWeight: '600' } );
	} );

	it( 'applies grouped overrides that include HTML before the HTML override', () => {
		expect(
			parseSettings( {
				'editor.fontSize': 20,
				'[ html ][css]': { 'editor.fontSize': 18, 'editor.tabSize': 3 },
				'[css][js]': { 'editor.tabSize': 8 },
				'[ html ]': { 'editor.fontSize': 16 },
			} )
		).toEqual( { editorSettings: { tabSize: 3 }, editorOptions: { fontSize: 16 } } );
	} );

	it( 'converts each scope before applying the HTML override', () => {
		expect(
			optionsOf( {
				'editor.quickSuggestions': false,
				'editor.hover.enabled': 'on',
				'[html]': {
					'editor.quickSuggestions': { comments: 'on' },
					'editor.hover': false,
				},
			} )
		).toEqual( {
			quickSuggestions: { other: 'off', comments: 'on', strings: 'off' },
			hover: { enabled: false },
		} );

		expect(
			optionsOf( {
				'editor.autoClosingBrackets': false,
				'[html]': { 'editor.autoClosingBrackets': 'always' },
			} )
		).toEqual( { autoClosingBrackets: 'always' } );
	} );

	it( 'prefers HTML-specific settings and ignores other languages', () => {
		expect(
			parseSettings( {
				'editor.fontSize': 20,
				'editor.tabSize': 4,
				'[html]': { 'editor.fontSize': 16, 'editor.hover': { enabled: false } },
				'[css]': { 'editor.tabSize': 8 },
			} )
		).toEqual( {
			editorSettings: { tabSize: 4 },
			editorOptions: { fontSize: 16, hover: { enabled: false } },
		} );
	} );

	it( 'restores an exported editor config', () => {
		const exported = exportEditorConfig(
			{ ...editorSettings, theme: 'monokai', tabSize: 4, emmet: false },
			{ ...editorOptions, fontSize: 20, hover: { enabled: 'off' } } as EditorOptions
		);
		expect( exported ).toMatchObject( {
			'customHtmlBlockExtension.theme': 'monokai',
			'customHtmlBlockExtension.emmet': false,
			'editor.tabSize': 4,
			'editor.fontSize': 20,
			'editor.hover.enabled': 'off',
			'editor.quickSuggestions': { other: 'on', comments: 'off', strings: 'off' },
		} );

		expect( parseSettings( exported ) ).toEqual( {
			editorSettings: { ...editorSettings, theme: 'monokai', tabSize: 4, emmet: false },
			editorOptions: { ...editorOptions, fontSize: 20, hover: { enabled: 'off' } },
		} );
	} );

	it( 'exports and imports a font name with a comma', () => {
		const exported = exportEditorConfig( editorSettings, {
			...editorOptions,
			fontFamily: 'ACME, Mono',
			fontWeight: '400',
		} );
		expect( exported[ 'editor.fontFamily' ] ).toBe( "'ACME, Mono'" );
		expect( optionsOf( exported )?.fontFamily ).toBe( 'ACME, Mono' );
	} );

	it( 'exports a font name with a comma and an apostrophe', () => {
		const exported = exportEditorConfig( editorSettings, {
			...editorOptions,
			fontFamily: "Writer's, Mono",
			fontWeight: '400',
		} );
		expect( exported[ 'editor.fontFamily' ] ).toBe( `"Writer's, Mono"` );
		expect( optionsOf( exported )?.fontFamily ).toBe( "Writer's, Mono" );
	} );

	it( 'prefers the theme of this plugin over the VS Code theme', () => {
		expect(
			settingsOf( {
				'workbench.colorTheme': 'Monokai',
				'customHtmlBlockExtension.theme': 'light',
			} )
		).toEqual( { theme: 'light' } );
		expect( settingsOf( { 'customHtmlBlockExtension.theme': 'unknown' } ) ).toEqual( {
			theme: null,
		} );
	} );

	it( 'sends a file exported by older versions as is', () => {
		const exported = {
			editorSettings: { theme: 'monokai', tabSize: 4, emmet: false },
			editorOptions: {
				fontSize: 20,
				hover: false,
				renderIndentGuides: false,
				rulers: 0,
			},
		};
		expect( parseSettings( exported ) ).toEqual( exported );
	} );

	it( 'checks the theme and font in a file exported by older versions', () => {
		expect(
			parseSettings( {
				editorSettings: { theme: 'unknown', tabSize: 4 },
				editorOptions: { fontFamily: 'Unknown Font', fontWeight: '400', fontSize: 20 },
			} )
		).toEqual( {
			editorSettings: { theme: null, tabSize: 4 },
			editorOptions: { fontFamily: null, fontWeight: '400', fontSize: 20 },
		} );
		expect(
			optionsOf( {
				editorSettings: {},
				editorOptions: { fontFamily: 'ACME, Mono', fontWeight: '700' },
			} )
		).toEqual( { fontFamily: 'ACME, Mono', fontWeight: '400' } );
		expect(
			optionsOf( { editorSettings: {}, editorOptions: { fontFamily: 'Ubuntu Mono' } } )
		).toEqual( { fontFamily: 'Ubuntu Mono' } );
	} );
} );

describe( 'countEditorConfig', () => {
	it( 'counts each property of an object option as one value', () => {
		expect(
			countEditorConfig( {
				editorSettings: { tabSize: 4 },
				editorOptions: {
					fontSize: 20,
					rulers: [ 80, 120 ],
					quickSuggestions: { other: 'off', comments: 'off', strings: 'off' },
				},
			} )
		).toBe( 6 );
	} );
} );

describe( 'mergeEditorOptions', () => {
	it( 'merges object options and replaces other options', () => {
		expect(
			mergeEditorOptions( { ...editorOptions, rulers: [ 80 ] } as EditorOptions, {
				fontSize: 20,
				rulers: [],
				quickSuggestions: { comments: 'on' },
			} )
		).toEqual( {
			...editorOptions,
			fontSize: 20,
			rulers: [],
			quickSuggestions: { other: 'on', comments: 'on', strings: 'off' },
		} );
	} );
} );

describe( 'getImportItems', () => {
	const currentConfig = { editorSettings, editorOptions };

	it( 'lists the changed values, with each property of an object option as one item', () => {
		const items = getImportItems(
			{
				editorSettings: { tabSize: 4, theme: 'vs-dark' },
				editorOptions: { fontSize: '20', quickSuggestions: { other: 'off', comments: 'off' } },
			},
			{
				editorSettings: { tabSize: 4, theme: 'vs-dark' },
				editorOptions: { fontSize: 20, quickSuggestions: { other: 'off', comments: 'off' } },
			},
			currentConfig
		);
		expect( items ).toEqual( [
			{
				group: 'editorSettings',
				path: 'tabSize',
				currentValue: 2,
				value: 4,
				originalValue: 4,
			},
			{
				group: 'editorOptions',
				path: 'fontSize',
				currentValue: 14,
				value: 20,
				originalValue: '20',
			},
			{
				group: 'editorOptions',
				path: 'quickSuggestions.other',
				currentValue: 'on',
				value: 'off',
				originalValue: 'off',
			},
		] );
		// A numeric string converted to the same number is not clamped.
		expect( items.map( isClampedItem ) ).toEqual( [ false, false, false ] );
	} );

	it( 'detects values clamped to the range', () => {
		const items = getImportItems(
			{ editorSettings: {}, editorOptions: { fontSize: 40, rulers: [ 80, { column: 120 } ] } },
			{ editorSettings: {}, editorOptions: { fontSize: 30, rulers: [ 80, { column: 100 } ] } },
			currentConfig
		);
		expect( items.map( isClampedItem ) ).toEqual( [ true, true ] );
	} );

	it( 'keeps a clamped value equal to the current one, and skips equal values', () => {
		const items = getImportItems(
			{
				editorSettings: {},
				editorOptions: { fontSize: 100, rulers: [ { color: '#fff', column: 80 } ] },
			},
			{
				editorSettings: {},
				editorOptions: { fontSize: 30, rulers: [ { color: '#fff', column: 80 } ] },
			},
			{
				editorSettings,
				editorOptions: {
					...editorOptions,
					fontSize: 30,
					rulers: [ { column: 80, color: '#fff' } ],
				} as EditorOptions,
			}
		);
		expect( items.map( ( item ) => item.path ) ).toEqual( [ 'fontSize' ] );
		expect( isClampedItem( items[ 0 ] ) ).toBe( true );
	} );
} );

describe( 'getUnchangedImportItems', () => {
	it( 'lists the values equal to the current ones, except clamped ones', () => {
		const items = getUnchangedImportItems(
			{ editorSettings: { tabSize: 2 }, editorOptions: { fontSize: 100, wordWrap: 'off' } },
			{ editorSettings: { tabSize: 2 }, editorOptions: { fontSize: 30, wordWrap: 'off' } },
			{
				editorSettings,
				editorOptions: { ...editorOptions, fontSize: 30, wordWrap: 'off' } as EditorOptions,
			}
		);
		expect( items.map( ( item ) => item.path ) ).toEqual( [ 'tabSize', 'wordWrap' ] );
	} );
} );

describe( 'buildEditorConfig', () => {
	it( 'builds the editor config from the items', () => {
		expect(
			JSON.parse(
				JSON.stringify(
					buildEditorConfig( [
						{
							group: 'editorSettings',
							path: 'tabSize',
							currentValue: 2,
							value: 4,
							originalValue: 4,
						},
						{
							group: 'editorOptions',
							path: 'minimap.enabled',
							currentValue: true,
							value: false,
							originalValue: false,
						},
					] )
				)
			)
		).toEqual( {
			editorSettings: { tabSize: 4 },
			editorOptions: { minimap: { enabled: false } },
		} );
	} );
} );
