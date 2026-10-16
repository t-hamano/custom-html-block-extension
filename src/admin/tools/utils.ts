/**
 * External dependencies
 */
import { parse, type ParseError } from 'jsonc-parser';

/**
 * Internal dependencies
 */
import type { EditorOptions, EditorSettings } from '../../types';
import themes from '../../lib/themes';

// Prefix of the settings that VS Code doesn't have, like an extension's
// settings, e.g. `customHtmlBlockExtension.theme`.
const SETTINGS_PREFIX = 'customHtmlBlockExtension.';

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

// Values that VS Code replaced, as `[ old value, new value ]` pairs. The
// server migrates the legacy values of this plugin's own options.
const LEGACY_VALUES: [ string, [ unknown, string ][] ][] = [
	[
		'autoIndent',
		[
			[ false, 'advanced' ],
			[ true, 'full' ],
		],
	],
	[ 'cursorBlinking', [ [ 'visible', 'solid' ] ] ],
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

// A language-specific override key, e.g. `[html]` or `[html][css]`.
const LANGUAGE_OVERRIDE_REGEX = /^(\[[^\[\]]+\])+$/;

// The editor config to validate, keyed like the saved editor config.
export type EditorConfigPayload = {
	editorSettings: Record< string, unknown >;
	editorOptions: Record< string, unknown >;
};

function isPlainObject( value: unknown ): value is Record< string, unknown > {
	return typeof value === 'object' && value !== null && ! Array.isArray( value );
}

/**
 * Flatten the `editor.*` settings into a map of option paths, so that both
 * `"editor.minimap.enabled": true` and `"editor.minimap": { "enabled": true }`
 * become `minimap.enabled`.
 *
 * @param settings The parsed settings.json, or a language-specific override.
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
 * Convert the VS Code settings whose key or value has another form in VS Code
 * into the form this plugin uses, so that settings in different scopes can be
 * merged by option path.
 *
 * @param vscodeSettings The flattened `editor.*` settings of one scope.
 * @return The settings with the converted values.
 */
function normalizeEditorSettings( vscodeSettings: Map< string, unknown > ) {
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
 * Get the `editor.*` settings that VS Code applies to HTML files: the global
 * settings, overridden by grouped overrides such as `"[html][css]": { ... }`,
 * overridden by `"[html]": { ... }`.
 *
 * @param settings The parsed settings.json.
 * @return The values keyed by option path.
 */
function getHTMLEditorSettings( settings: Record< string, unknown > ) {
	const groupedOverrides: unknown[] = [];
	const htmlOverrides: unknown[] = [];
	Object.entries( settings ).forEach( ( [ key, value ] ) => {
		if ( ! LANGUAGE_OVERRIDE_REGEX.test( key ) ) {
			return;
		}
		// VS Code ignores spaces around each language, e.g. `[ html ]`.
		const languages = key
			.slice( 1, -1 )
			.split( '][' )
			.map( ( language ) => language.trim() );
		if ( languages.includes( 'html' ) ) {
			( languages.length > 1 ? groupedOverrides : htmlOverrides ).push( value );
		}
	} );
	const scopes = [ settings, ...groupedOverrides, ...htmlOverrides ];

	const vscodeSettings = new Map< string, unknown >();
	scopes.filter( isPlainObject ).forEach( ( scope ) => {
		normalizeEditorSettings( flattenEditorSettings( scope ) ).forEach( ( value, path ) =>
			vscodeSettings.set( path, value )
		);
	} );
	return vscodeSettings;
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
 * Whether a value is a theme of this plugin: a bundled theme or one of
 * Monaco's built-in themes.
 *
 * @param value The theme slug.
 * @return Whether the theme exists.
 */
function isTheme( value: unknown ): value is string {
	return (
		value === 'vs-dark' || value === 'light' || themes.some( ( theme ) => theme.value === value )
	);
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
 * format. A value that can't be converted becomes `undefined`, so that the
 * server skips it.
 *
 * @param settings             The parsed settings.json.
 * @param currentEditorOptions The current editor options.
 * @return The flattened `editor.*` settings with the converted values.
 */
function migrateVSCodeSettings(
	settings: Record< string, unknown >,
	currentEditorOptions: EditorOptions
) {
	const vscodeSettings = getHTMLEditorSettings( settings );

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

	// The theme and Emmet exported by this plugin take priority over VS Code's
	// settings.
	const theme = settings[ `${ SETTINGS_PREFIX }theme` ];
	if ( theme !== undefined ) {
		vscodeSettings.set( 'theme', isTheme( theme ) ? theme : undefined );
	}
	const emmet = settings[ `${ SETTINGS_PREFIX }emmet` ];
	if ( emmet !== undefined ) {
		vscodeSettings.set( 'emmet', emmet );
	}

	// An older VS Code version turned off auto closing quotes and surrounding
	// together with brackets. Convert it after merging the scopes, because a
	// language-specific override may turn brackets on again.
	if ( vscodeSettings.get( 'autoClosingBrackets' ) === false ) {
		vscodeSettings.set( 'autoClosingBrackets', 'never' );
		[ 'autoClosingQuotes', 'autoSurround' ].forEach( ( path ) => {
			if ( ! vscodeSettings.has( path ) ) {
				vscodeSettings.set( path, 'never' );
			}
		} );
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
	const font =
		fontName === 'monospace'
			? undefined
			: window.chbeObj.fontFamily.find( ( { name } ) => name === fontName );
	const fontWeights = fontName === 'monospace' ? MONOSPACE_FONT_WEIGHTS : font?.weight;
	const fontWeight = vscodeSettings.get( 'fontWeight' );
	if ( fontWeight !== undefined ) {
		const weight =
			typeof fontWeight === 'string' || typeof fontWeight === 'number'
				? ( FONT_WEIGHT_KEYWORDS.get( fontWeight ) ?? String( fontWeight ) )
				: undefined;
		vscodeSettings.set(
			'fontWeight',
			// A font registered without weights accepts any weight.
			weight && ( fontWeights?.includes( Number( weight ) ) ?? font !== undefined )
				? weight
				: undefined
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

	return vscodeSettings;
}

/**
 * Convert the editor config to the format of VS Code's `settings.json`. The
 * theme and Emmet, which VS Code doesn't have, get the `customHtmlBlockExtension.`
 * prefix.
 *
 * @param editorSettings The editor settings.
 * @param editorOptions  The editor options.
 * @return The settings keyed by setting name, e.g. `editor.minimap.enabled`.
 */
export function exportEditorConfig(
	editorSettings: EditorSettings,
	editorOptions: EditorOptions
): Record< string, unknown > {
	const settings: Record< string, unknown > = {
		[ `${ SETTINGS_PREFIX }theme` ]: editorSettings.theme,
		[ `${ SETTINGS_PREFIX }emmet` ]: editorSettings.emmet,
		'editor.tabSize': editorSettings.tabSize,
		'editor.insertSpaces': editorSettings.insertSpaces,
		'editor.detectIndentation': editorSettings.detectIndentation,
	};

	Object.entries( editorOptions ).forEach( ( [ key, value ] ) => {
		// VS Code has a setting for each sub-option, except for
		// `editor.quickSuggestions`, which is an object.
		if ( isPlainObject( value ) && key !== 'quickSuggestions' ) {
			Object.entries( value ).forEach( ( [ subKey, subValue ] ) => {
				settings[ `editor.${ key }.${ subKey }` ] = subValue;
			} );
			return;
		}
		settings[ `editor.${ key }` ] = value;
	} );

	// VS Code uses a CSS font stack, so quote a font name with a comma.
	const fontFamily = settings[ 'editor.fontFamily' ];
	if ( typeof fontFamily === 'string' && fontFamily.includes( ',' ) ) {
		const quote = fontFamily.includes( "'" ) ? '"' : "'";
		settings[ 'editor.fontFamily' ] = `${ quote }${ fontFamily }${ quote }`;
	}

	return settings;
}

/**
 * Set a value at an option path, e.g. `minimap.enabled`, creating the objects
 * on the way. The objects have no prototype, so that a key like `__proto__` is
 * set as a property.
 *
 * @param object The object to set the value in.
 * @param path   The option path.
 * @param value  The value.
 */
function setPath( object: Record< string, unknown >, path: string, value: unknown ) {
	const keys = path.split( '.' );
	const lastKey = keys.pop() as string;
	let target = object;
	keys.forEach( ( key ) => {
		if ( ! isPlainObject( target[ key ] ) ) {
			target[ key ] = Object.create( null );
		}
		target = target[ key ] as Record< string, unknown >;
	} );
	target[ lastKey ] = value;
}

/**
 * Parse a VS Code `settings.json`, or a file exported by this plugin, into the
 * editor config to send to the server, which validates it. A file exported by
 * older versions, which has the `editorSettings` and `editorOptions` objects,
 * is sent as is, since the server migrates its legacy values.
 *
 * @param text                 The JSON text.
 * @param currentEditorOptions The current editor options.
 * @return The editor config, or `null` if the text is not a JSON object.
 */
export function parseEditorConfig(
	text: string,
	currentEditorOptions: EditorOptions
): EditorConfigPayload | null {
	const errors: ParseError[] = [];
	const data = parse( text, errors, { allowTrailingComma: true } );

	if ( errors.length > 0 || ! isPlainObject( data ) ) {
		return null;
	}

	if ( isPlainObject( data.editorSettings ) && isPlainObject( data.editorOptions ) ) {
		return { editorSettings: data.editorSettings, editorOptions: data.editorOptions };
	}

	const payload: EditorConfigPayload = {
		editorSettings: Object.create( null ),
		editorOptions: Object.create( null ),
	};
	migrateVSCodeSettings( data, currentEditorOptions ).forEach( ( value, path ) => {
		const target = ( EDITOR_SETTING_KEYS as readonly string[] ).includes( path )
			? payload.editorSettings
			: payload.editorOptions;
		// Send `null` instead of `undefined`, which JSON drops, so that the server
		// counts a value that couldn't be converted as skipped.
		setPath( target, path, value ?? null );
	} );
	return payload;
}

/**
 * Count the values of the editor config, counting each property of an object
 * option, e.g. `minimap.enabled`, as one value.
 *
 * @param values The editor settings or options.
 * @return The number of values.
 */
function countValues( values: Record< string, unknown > ) {
	return Object.values( values ).reduce< number >(
		( count, value ) => count + ( isPlainObject( value ) ? Object.keys( value ).length : 1 ),
		0
	);
}

/**
 * Get the number of the values that the server accepted.
 *
 * @param editorConfig The validated editor config.
 * @return The number of the imported values.
 */
export function countEditorConfig( editorConfig: EditorConfigPayload ) {
	return countValues( editorConfig.editorSettings ) + countValues( editorConfig.editorOptions );
}

/**
 * Merge the validated editor options into the current ones. Each property of an
 * object option replaces the current one, and other options replace the current
 * value.
 *
 * @param currentEditorOptions The current editor options.
 * @param editorOptions        The validated editor options.
 * @return The merged editor options.
 */
export function mergeEditorOptions(
	currentEditorOptions: EditorOptions,
	editorOptions: Record< string, unknown >
): EditorOptions {
	const options: Record< string, unknown > = { ...currentEditorOptions };
	Object.entries( editorOptions ).forEach( ( [ key, value ] ) => {
		options[ key ] =
			isPlainObject( value ) && isPlainObject( options[ key ] )
				? { ...options[ key ], ...value }
				: value;
	} );
	return options as EditorOptions;
}
