/**
 * External dependencies
 */
import { parse, type ParseError } from 'jsonc-parser';

/**
 * Internal dependencies
 */
import type { EditorOptions, EditorSettings } from '../../../../types';
import themes from '../../../../lib/themes';

// Editor settings that map to VS Code's `editor.*` settings.
const EDITOR_SETTING_KEYS = [ 'tabSize', 'insertSpaces', 'detectIndentation' ] as const;

// Options whose VS Code values need a conversion, which is not supported yet.
const UNSUPPORTED_OPTION_KEYS = [ 'fontFamily', 'fontWeight', 'lineHeight' ];

// VS Code's built-in themes that map to Monaco's built-in themes.
const BUILT_IN_THEMES: Record< string, string > = {
	'default dark modern': 'vs-dark',
	'default dark+': 'vs-dark',
	'dark modern': 'vs-dark',
	'dark+': 'vs-dark',
	'visual studio dark': 'vs-dark',
	'default light modern': 'light',
	'default light+': 'light',
	'light modern': 'light',
	'light+': 'light',
	'visual studio light': 'light',
};

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
 * @param name The `workbench.colorTheme` value.
 * @return The theme slug, or `undefined` if no theme matches.
 */
function findTheme( name: string ): string | undefined {
	const normalizedName = name.trim().toLowerCase();
	if ( BUILT_IN_THEMES[ normalizedName ] ) {
		return BUILT_IN_THEMES[ normalizedName ];
	}
	const slug = normalizedName.replace( /[^a-z0-9]+/g, '-' ).replace( /^-|-$/g, '' );
	return themes.find( ( theme ) => theme.value === slug )?.value;
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
 * Parse a VS Code `settings.json` and merge the supported `editor.*` settings
 * and `workbench.colorTheme` into the current editor config.
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

	const vscodeSettings = flattenEditorSettings( settings );
	const editorSettings = { ...currentEditorSettings };
	const editorOptions = structuredClone( currentEditorOptions );
	let importedCount = 0;
	let vscodeSettingsCount = vscodeSettings.size;

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

	const colorTheme = settings[ 'workbench.colorTheme' ];
	if ( colorTheme !== undefined ) {
		vscodeSettingsCount++;
		const theme = typeof colorTheme === 'string' ? findTheme( colorTheme ) : undefined;
		if ( theme ) {
			editorSettings.theme = theme;
			importedCount++;
		}
	}

	EDITOR_SETTING_KEYS.forEach( ( key ) => {
		importValue( key, currentEditorSettings[ key ], ( value ) => {
			( editorSettings as Record< string, unknown > )[ key ] = value;
		} );
	} );

	const options = editorOptions as Record< string, unknown >;
	Object.entries( currentEditorOptions ).forEach( ( [ key, currentValue ] ) => {
		if ( UNSUPPORTED_OPTION_KEYS.includes( key ) ) {
			return;
		}

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
		skippedCount: vscodeSettingsCount - importedCount,
	};
}
