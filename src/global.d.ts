/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * Internal dependencies
 */
import type { EditorSettings, EditorOptions, Options, FontFamily, UserRole } from './types';

declare global {
	/**
	 * Data localized from PHP via `wp_localize_script`.
	 */
	interface ChbeObj {
		pluginUrl: string;
		version: string;
		editorSettings: EditorSettings;
		editorOptions: EditorOptions;
		options: Options;
		fontFamily: FontFamily[];
		userRoles: UserRole[];
		dismissWelcomeGuide: boolean;
	}

	/**
	 * The AMD loader exposed by the monaco `loader.js` script.
	 */
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
		wp?: unknown;
		jQuery?: unknown;
	}
}

export {};
