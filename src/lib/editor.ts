/**
 * Monaco editor setup shared by the block, classic, and theme/plugin editors.
 */

/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * Internal dependencies
 */
import themes from './themes';
import type { EditorOptions } from '../types';

/**
 * Build the options passed to `monaco.editor.create`.
 *
 * @param args           Arguments.
 * @param args.defaults  Options that the editor options can override.
 * @param args.options   Editor options saved in the settings.
 * @param args.overrides Options that override the editor options.
 * @return Construction options.
 */
export function getConstructionOptions( {
	defaults = {},
	options,
	overrides = {},
}: {
	defaults?: Record< string, unknown >;
	options: Partial< EditorOptions >;
	overrides?: Record< string, unknown >;
} ): Monaco.editor.IStandaloneEditorConstructionOptions {
	return {
		...defaults,
		...options,
		...overrides,
		// Monaco's HTML outline is flat, so the default `outlineModel` pins no lines in sticky scroll.
		stickyScroll: {
			...options.stickyScroll,
			defaultModel: 'foldingProviderModel',
		},
	} as Monaco.editor.IStandaloneEditorConstructionOptions;
}

/**
 * Apply a built-in theme or one of the bundled custom themes.
 *
 * @param monaco The monaco instance.
 * @param theme  Theme name.
 */
export function applyTheme( monaco: typeof Monaco, theme: string ) {
	if ( 'vs-dark' === theme || 'light' === theme ) {
		monaco.editor.setTheme( theme );
		return;
	}
	const targetTheme = themes.find( ( data ) => theme === data.value );
	if ( targetTheme ) {
		monaco.editor.defineTheme( targetTheme.value, targetTheme.data );
		monaco.editor.setTheme( targetTheme.value );
	}
}

/**
 * Apply the bracket pair colorization option to the model. The standalone editor
 * doesn't pass the `bracketPairColorization` editor option on to the model, so set
 * it on the model directly.
 *
 * @see https://github.com/microsoft/monaco-editor/issues/3829
 *
 * @param model                   The editor model.
 * @param bracketPairColorization Bracket pair colorization option.
 */
export function applyBracketPairColorization(
	model: Monaco.editor.ITextModel | null | undefined,
	bracketPairColorization: EditorOptions[ 'bracketPairColorization' ] | undefined
) {
	if ( model && bracketPairColorization ) {
		model.updateOptions( {
			bracketColorizationOptions: bracketPairColorization,
		} );
	}
}
