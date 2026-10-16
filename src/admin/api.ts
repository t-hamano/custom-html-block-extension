/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import type { EditorSettings, EditorOptions, Options } from '../types';
import type { EditorConfigPayload } from './tools/utils';

type Settings = {
	editorSettings: EditorSettings;
	editorOptions: EditorOptions;
	options: Options;
};

// Names of the options this plugin registers in `/wp/v2/settings`.
const OPTION_NAMES = {
	editorSettings: 'custom_html_block_extension_editor_settings',
	editorOptions: 'custom_html_block_extension_editor_options',
	options: 'custom_html_block_extension_options',
} as const satisfies Record< keyof Settings, string >;

const SETTINGS_PATH = `/wp/v2/settings?_fields=${ Object.values( OPTION_NAMES ).join( ',' ) }`;

function fromResponse( response: Record< string, unknown > ): Settings {
	return Object.fromEntries(
		Object.entries( OPTION_NAMES ).map( ( [ key, name ] ) => [ key, response[ name ] ] )
	) as Settings;
}

/**
 * Get the plugin settings, merged with the default values.
 */
export async function getSettings(): Promise< Settings > {
	return fromResponse( await apiFetch( { path: SETTINGS_PATH } ) );
}

/**
 * Update the given plugin settings.
 *
 * @param settings Settings to update. `null` resets a setting to its default value.
 */
export async function updateSettings( settings: {
	[ K in keyof Settings ]?: Settings[ K ] | null;
} ): Promise< Settings > {
	const data = Object.fromEntries(
		Object.entries( settings ).map( ( [ key, value ] ) => [
			OPTION_NAMES[ key as keyof Settings ],
			value,
		] )
	);

	return fromResponse( await apiFetch( { path: SETTINGS_PATH, method: 'POST', data } ) );
}

/**
 * Validate an imported editor config without saving it.
 *
 * @param editorConfig The editor config to validate.
 * @return The valid values, and the paths of the skipped values.
 */
export async function validateEditorConfig(
	editorConfig: EditorConfigPayload
): Promise< EditorConfigPayload & { skipped: string[] } > {
	return apiFetch( {
		path: '/custom-html-block-extension/v1/validate_editor_config',
		method: 'POST',
		data: editorConfig,
	} );
}
