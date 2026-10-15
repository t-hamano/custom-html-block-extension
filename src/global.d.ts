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
		monacoVersion: string;
		version: string;
		editorSettings: EditorSettings;
		editorOptions: EditorOptions;
		options: Options;
		fontFamily: FontFamily[];
		userRoles: { label: string; value: string }[];
		language?: string;
	}

	interface Window {
		chbeObj: ChbeObj;
		monaco?: typeof Monaco;
		MonacoEnvironment?: Monaco.Environment;
		enabledEmmet?: boolean;
		editor?: Monaco.editor.IStandaloneCodeEditor;
		wp?: unknown;
		jQuery?: ( callback: () => void ) => unknown;
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

// The `__unstableIsHtml` option of `useBlockProps` is missing from the package types.
declare module '@wordpress/block-editor/components/use-block-props' {
	interface UseBlockProps {
		< Props extends Record< string, unknown > >(
			props: Props,
			options: { __unstableIsHtml?: boolean }
		): Omit< Props, 'ref' > & Merged & Reserved;
	}
}

export {};
