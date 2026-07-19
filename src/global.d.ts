/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * Internal dependencies
 */
import type { EditorSettings, EditorOptions, Options, FontFamily } from './types';

declare global {
	// Data localized from PHP via `wp_localize_script`.
	interface ChbeObj {
		pluginUrl: string;
		version: string;
		editorSettings: EditorSettings;
		editorOptions: EditorOptions;
		options: Options;
		fontFamily: FontFamily[];
		userRoles: { label: string; value: string }[];
		dismissWelcomeGuide: boolean;
		language?: string;
	}

	// The AMD loader exposed by the monaco `loader.js` script.
	interface MonacoAmdRequire {
		( modules: string[], onLoad: () => void ): void;
		config: ( config: { paths: Record< string, string > } ) => void;
	}

	interface Window {
		chbeObj: ChbeObj;
		monaco?: typeof Monaco;
		require: MonacoAmdRequire;
		isInitialized?: boolean;
		enabledEmmet?: boolean;
		editor?: Monaco.editor.IStandaloneCodeEditor;
		WebKitMutationObserver?: typeof MutationObserver;
		wp?: unknown;
		jQuery?: unknown;
	}
}

// The `inert` attribute is missing from the React 18 types (added natively in
// React 19); declare it here. Use the empty-string form to avoid React 18's
// non-boolean attribute warning.
declare module 'react' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface HTMLAttributes< T > {
		inert?: '' | undefined;
	}
}

// `privateApis` is exported at runtime but missing from the package types.
declare module '@wordpress/block-editor' {
	export const privateApis: unknown;
}

export {};
