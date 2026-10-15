/**
 * External dependencies
 */
import { parse, type ParseError } from 'jsonc-parser';

/**
 * WordPress dependencies
 */
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import type { EditorOptions, EditorSettings } from '../../../../types';
import themes from '../../../../lib/themes';

// Editor settings that map to VS Code's `editor.*` settings, including the
// ones added by `migrateVSCodeSettings()`.
const EDITOR_SETTING_KEYS = [
	'theme',
	'tabSize',
	'insertSpaces',
	'detectIndentation',
	'emmet',
] as const;

// Keyword values of VS Code's `editor.fontWeight`.
const FONT_WEIGHT_KEYWORDS = new Map< unknown, string >( [
	[ 'normal', '400' ],
	[ 'bold', '700' ],
] );

// Weights of the generic `monospace` font, which usually has only normal and
// bold faces.
const MONOSPACE_FONT_WEIGHTS = [ 400, 700 ];

// VS Code treats a line height below this as a multiplier of the font size.
const MIN_LINE_HEIGHT = 8;

// VS Code's built-in themes that map to Monaco's built-in themes.
const BUILT_IN_THEMES = new Map( [
	[ 'dark 2026', 'vs-dark' ],
	[ 'default dark modern', 'vs-dark' ],
	[ 'default dark+', 'vs-dark' ],
	[ 'dark modern', 'vs-dark' ],
	[ 'dark+', 'vs-dark' ],
	[ 'dark (visual studio)', 'vs-dark' ],
	[ 'visual studio dark', 'vs-dark' ],
	[ 'light 2026', 'light' ],
	[ 'default light modern', 'light' ],
	[ 'default light+', 'light' ],
	[ 'light modern', 'light' ],
	[ 'light+', 'light' ],
	[ 'light (visual studio)', 'light' ],
	[ 'visual studio light', 'light' ],
] );

// Settings renamed in VS Code, with the old option path first. See
// https://github.com/microsoft/vscode/blob/main/src/vs/editor/browser/config/migrateOptions.ts
const RENAMED_SETTINGS = [
	[ 'hover', 'hover.enabled' ],
	[ 'renderIndentGuides', 'guides.indentation' ],
	[ 'highlightActiveIndentGuide', 'guides.highlightActiveIndentation' ],
	[ 'experimental.stickyScroll.enabled', 'stickyScroll.enabled' ],
	[ 'experimental.stickyScroll.maxLineCount', 'stickyScroll.maxLineCount' ],
] as const;

// Values that VS Code replaced, as `[ old value, new value ]` pairs.
const LEGACY_VALUES: [ string, [ unknown, string ][] ][] = [
	[
		'acceptSuggestionOnEnter',
		[
			[ true, 'on' ],
			[ false, 'off' ],
		],
	],
	[
		'autoIndent',
		[
			[ false, 'advanced' ],
			[ true, 'full' ],
		],
	],
	[ 'cursorBlinking', [ [ 'visible', 'solid' ] ] ],
	[
		'cursorSmoothCaretAnimation',
		[
			[ true, 'on' ],
			[ false, 'off' ],
		],
	],
	[
		'hover.enabled',
		[
			[ true, 'on' ],
			[ false, 'off' ],
		],
	],
	[
		'lineNumbers',
		[
			[ true, 'on' ],
			[ false, 'off' ],
		],
	],
	[
		'matchBrackets',
		[
			[ true, 'always' ],
			[ false, 'never' ],
		],
	],
	[
		'minimap.autohide',
		[
			[ true, 'mouseover' ],
			[ false, 'none' ],
		],
	],
	[
		'occurrencesHighlight',
		[
			[ true, 'singleFile' ],
			[ false, 'off' ],
		],
	],
	[
		'renderFinalNewline',
		[
			[ true, 'on' ],
			[ false, 'off' ],
		],
	],
	[
		'renderLineHighlight',
		[
			[ true, 'line' ],
			[ false, 'none' ],
		],
	],
	[
		'renderWhitespace',
		[
			[ true, 'boundary' ],
			[ false, 'none' ],
		],
	],
	[
		'wordWrap',
		[
			[ true, 'on' ],
			[ false, 'off' ],
		],
	],
];

const MAX_RULER_COLUMN = 100;

// Same as `sanitize_hex_color()`, which validates the `hex-color` format.
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{3}){1,2}$/;

type ImportResult = {
	editorSettings: EditorSettings;
	editorOptions: EditorOptions;
	importedCount: number;
	skippedCount: number;
};

function isPlainObject( value: unknown ): value is Record< string, unknown > {
	return typeof value === 'object' && value !== null && ! Array.isArray( value );
}

/**
 * Flatten the `editor.*` settings into a map of option paths, so that both
 * `"editor.minimap.enabled": true` and `"editor.minimap": { "enabled": true }`
 * become `minimap.enabled`.
 *
 * @param settings The parsed settings.json.
 * @return The values keyed by option path.
 */
function flattenEditorSettings( settings: Record< string, unknown > ) {
	const flattened = new Map< string, unknown >();

	const flatten = ( path: string, value: unknown ) => {
		if ( isPlainObject( value ) ) {
			Object.entries( value ).forEach( ( [ key, childValue ] ) =>
				flatten( `${ path }.${ key }`, childValue )
			);
			return;
		}
		flattened.set( path, value );
	};

	Object.entries( settings ).forEach( ( [ key, value ] ) => {
		if ( key.startsWith( 'editor.' ) ) {
			flatten( key.slice( 'editor.'.length ), value );
		}
	} );

	return flattened;
}

/**
 * Find the theme matching a VS Code theme name. Bundled themes match when the
 * name equals the theme slug ignoring case, spaces and punctuation, e.g.
 * `Solarized Dark` or `MagicWB (Amiga)`.
 *
 * @param name The VS Code theme name.
 * @return The theme slug, or `undefined` if no theme matches.
 */
function findTheme( name: string ): string | undefined {
	const normalizedName = name.trim().toLowerCase();
	const builtInTheme = BUILT_IN_THEMES.get( normalizedName );
	if ( builtInTheme ) {
		return builtInTheme;
	}
	const slug = normalizedName.replace( /[^a-z0-9]+/g, '-' ).replace( /^-|-$/g, '' );
	return themes.find( ( theme ) => theme.value === slug )?.value;
}

/**
 * Find the first font in a CSS font stack, e.g. `"'Fira Code', Consolas,
 * monospace"`, that this plugin has: a registered font or the generic
 * `monospace`. Font names match ignoring case.
 *
 * @param fontStack The VS Code font stack.
 * @return The font name, or `undefined` if no font matches.
 */
function findFontFamily( fontStack: string ): string | undefined {
	// Split on the commas outside quotes, as a quoted name can contain one.
	const fontNames = ( fontStack.match( /'[^']*'|"[^"]*"|[^,]+/g ) ?? [] ).map( ( fontName ) =>
		fontName
			.trim()
			.replace( /^['"]|['"]$/g, '' )
			.toLowerCase()
	);
	for ( const fontName of fontNames ) {
		if ( fontName === 'monospace' ) {
			return fontName;
		}
		const font = window.chbeObj.fontFamily.find( ( { name } ) => name.toLowerCase() === fontName );
		if ( font ) {
			return font.name;
		}
	}
	return undefined;
}

/**
 * Flatten the `editor.*` settings and convert the VS Code settings whose key
 * or value differs from this plugin into option paths in this plugin's
 * format. A value that can't be converted becomes `undefined`, so it is
 * counted as skipped.
 *
 * @param settings             The parsed settings.json.
 * @param currentEditorOptions The current editor options.
 * @return The flattened `editor.*` settings with the converted values.
 */
function migrateVSCodeSettings(
	settings: Record< string, unknown >,
	currentEditorOptions: EditorOptions
) {
	const vscodeSettings = flattenEditorSettings( settings );

	// `editor.theme` and `editor.emmet` are not VS Code settings, so only the
	// converted values below are imported.
	vscodeSettings.delete( 'theme' );
	vscodeSettings.delete( 'emmet' );

	// With `window.autoDetectColorScheme`, VS Code uses the preferred theme
	// instead of `workbench.colorTheme`. Use the dark one, like the default
	// theme of this plugin.
	const colorTheme =
		settings[ 'window.autoDetectColorScheme' ] === true
			? settings[ 'workbench.preferredDarkColorTheme' ]
			: settings[ 'workbench.colorTheme' ];
	if ( colorTheme !== undefined ) {
		vscodeSettings.set(
			'theme',
			typeof colorTheme === 'string' ? findTheme( colorTheme ) : undefined
		);
	}

	// VS Code has no key to turn Emmet off, but `"never"` hides its suggestions.
	const showExpandedAbbreviation = settings[ 'emmet.showExpandedAbbreviation' ];
	if ( showExpandedAbbreviation !== undefined ) {
		vscodeSettings.set(
			'emmet',
			typeof showExpandedAbbreviation === 'string'
				? showExpandedAbbreviation !== 'never'
				: undefined
		);
	}

	// VS Code uses a CSS font stack. Use the first font that this plugin has.
	const fontFamily = vscodeSettings.get( 'fontFamily' );
	if ( fontFamily !== undefined ) {
		vscodeSettings.set(
			'fontFamily',
			typeof fontFamily === 'string' ? findFontFamily( fontFamily ) : undefined
		);
	}

	// The weight must be one of the weights of the font.
	const fontName = vscodeSettings.get( 'fontFamily' ) ?? currentEditorOptions.fontFamily;
	const fontWeights =
		fontName === 'monospace'
			? MONOSPACE_FONT_WEIGHTS
			: window.chbeObj.fontFamily.find( ( { name } ) => name === fontName )?.weight;
	const fontWeight = vscodeSettings.get( 'fontWeight' );
	if ( fontWeight !== undefined ) {
		const weight =
			typeof fontWeight === 'string' || typeof fontWeight === 'number'
				? ( FONT_WEIGHT_KEYWORDS.get( fontWeight ) ?? String( fontWeight ) )
				: undefined;
		vscodeSettings.set(
			'fontWeight',
			weight && fontWeights?.includes( Number( weight ) ) ? weight : undefined
		);
	}

	// When the imported font doesn't have the current weight, use its normal
	// weight, or its first one.
	if (
		vscodeSettings.get( 'fontFamily' ) !== undefined &&
		vscodeSettings.get( 'fontWeight' ) === undefined &&
		fontWeights?.length &&
		! fontWeights.includes( Number( currentEditorOptions.fontWeight ) )
	) {
		vscodeSettings.set(
			'fontWeight',
			String( fontWeights.includes( 400 ) ? 400 : fontWeights[ 0 ] )
		);
	}

	// VS Code accepts `0` (computed from the font size) or a multiplier of the
	// font size, but this plugin only accepts pixels. Without `editor.fontSize`,
	// VS Code uses its own default font size, which depends on the OS.
	const lineHeight = vscodeSettings.get( 'lineHeight' );
	if ( typeof lineHeight === 'number' && lineHeight < MIN_LINE_HEIGHT ) {
		const isMac = isAppleOS();
		const defaultFontSize = isMac ? 12 : 14;
		const defaultLineHeightRatio = isMac ? 1.5 : 1.35;
		const fontSize = vscodeSettings.get( 'fontSize' );
		const baseFontSize = typeof fontSize === 'number' && fontSize > 0 ? fontSize : defaultFontSize;
		const ratio = lineHeight > 0 ? lineHeight : defaultLineHeightRatio;
		vscodeSettings.set(
			'lineHeight',
			Math.max( MIN_LINE_HEIGHT, Math.round( baseFontSize * ratio ) )
		);
	}

	// VS Code accepts a `font-feature-settings` string, but this plugin only
	// turns ligatures on or off.
	if ( typeof vscodeSettings.get( 'fontLigatures' ) === 'string' ) {
		vscodeSettings.set( 'fontLigatures', true );
	}

	// VS Code accepts a boolean that applies to all token types.
	const quickSuggestions = vscodeSettings.get( 'quickSuggestions' );
	if ( typeof quickSuggestions === 'boolean' ) {
		const value = quickSuggestions ? 'on' : 'off';
		vscodeSettings.delete( 'quickSuggestions' );
		vscodeSettings.set( 'quickSuggestions.other', value );
		vscodeSettings.set( 'quickSuggestions.comments', value );
		vscodeSettings.set( 'quickSuggestions.strings', value );
	}

	// Values from older VS Code versions, which VS Code still migrates.
	RENAMED_SETTINGS.forEach( ( [ oldPath, newPath ] ) => {
		if ( ! vscodeSettings.has( oldPath ) ) {
			return;
		}
		if ( ! vscodeSettings.has( newPath ) ) {
			vscodeSettings.set( newPath, vscodeSettings.get( oldPath ) );
		}
		vscodeSettings.delete( oldPath );
	} );

	if ( vscodeSettings.get( 'autoClosingBrackets' ) === false ) {
		vscodeSettings.set( 'autoClosingBrackets', 'never' );
		[ 'autoClosingQuotes', 'autoSurround' ].forEach( ( path ) => {
			if ( ! vscodeSettings.has( path ) ) {
				vscodeSettings.set( path, 'never' );
			}
		} );
	}

	LEGACY_VALUES.forEach( ( [ path, values ] ) => {
		const value = vscodeSettings.get( path );
		const legacyValue = values.find( ( [ oldValue ] ) => oldValue === value );
		if ( legacyValue ) {
			vscodeSettings.set( path, legacyValue[ 1 ] );
		}
	} );

	return vscodeSettings;
}

/**
 * Whether a ruler matches the settings schema: a column from 1 to 100, or an
 * object with a column and a 3- or 6-digit hex color (the `hex-color` format).
 *
 * @param ruler The imported ruler.
 * @return Whether the ruler is valid.
 */
function isValidRuler( ruler: unknown ): boolean {
	const isValidColumn = ( column: unknown ) =>
		typeof column === 'number' && column >= 1 && column <= MAX_RULER_COLUMN;

	if ( ! isPlainObject( ruler ) ) {
		return isValidColumn( ruler );
	}

	return (
		Object.keys( ruler ).every( ( key ) => key === 'column' || key === 'color' ) &&
		isValidColumn( ruler.column ) &&
		typeof ruler.color === 'string' &&
		HEX_COLOR_REGEX.test( ruler.color )
	);
}

/**
 * Whether the imported value can replace the current value. The value must
 * have the same type as the current one so that the settings REST API accepts it.
 *
 * @param path         The option path.
 * @param value        The imported value.
 * @param currentValue The current value.
 * @return Whether the value can be imported.
 */
function isAcceptableValue( path: string, value: unknown, currentValue: unknown ): boolean {
	if ( Array.isArray( currentValue ) ) {
		if ( ! Array.isArray( value ) ) {
			return false;
		}
		// The REST API rejects the whole request if a single ruler doesn't
		// match the settings schema.
		if ( path === 'rulers' ) {
			return value.every( isValidRuler );
		}
		return true;
	}

	return typeof value === typeof currentValue;
}

/**
 * Parse a VS Code `settings.json` and merge the supported `editor.*` settings,
 * the theme and Emmet into the current editor config.
 *
 * @param text                  The settings.json text.
 * @param currentEditorSettings The current editor settings.
 * @param currentEditorOptions  The current editor options.
 * @return The merged editor config, or `null` if the text is not a JSON object.
 */
export function importVSCodeSettings(
	text: string,
	currentEditorSettings: EditorSettings,
	currentEditorOptions: EditorOptions
): ImportResult | null {
	const errors: ParseError[] = [];
	const settings = parse( text, errors, { allowTrailingComma: true } );

	if ( errors.length > 0 || ! isPlainObject( settings ) ) {
		return null;
	}

	const vscodeSettings = migrateVSCodeSettings( settings, currentEditorOptions );
	const editorSettings = { ...currentEditorSettings };
	const editorOptions = structuredClone( currentEditorOptions );
	let importedCount = 0;

	const importValue = (
		path: string,
		currentValue: unknown,
		apply: ( value: unknown ) => void
	) => {
		if ( ! vscodeSettings.has( path ) ) {
			return;
		}
		const value = vscodeSettings.get( path );
		if ( isAcceptableValue( path, value, currentValue ) ) {
			apply( value );
			importedCount++;
		}
	};

	EDITOR_SETTING_KEYS.forEach( ( key ) => {
		importValue( key, currentEditorSettings[ key ], ( value ) => {
			( editorSettings as Record< string, unknown > )[ key ] = value;
		} );
	} );

	const options = editorOptions as Record< string, unknown >;
	Object.entries( currentEditorOptions ).forEach( ( [ key, currentValue ] ) => {
		if ( isPlainObject( currentValue ) ) {
			Object.entries( currentValue ).forEach( ( [ subKey, currentSubValue ] ) => {
				importValue( `${ key }.${ subKey }`, currentSubValue, ( value ) => {
					( options[ key ] as Record< string, unknown > )[ subKey ] = value;
				} );
			} );
			return;
		}

		importValue( key, currentValue, ( value ) => {
			options[ key ] = value;
		} );
	} );

	return {
		editorSettings,
		editorOptions,
		importedCount,
		skippedCount: vscodeSettings.size - importedCount,
	};
}
