/**
 * Type declarations for the MonacoEditor component, whose implementation
 * remains in JavaScript for now (see index.js). This only describes the
 * component's public props so TypeScript consumers can type-check usage.
 */
/**
 * External dependencies
 */
import type { ComponentType } from 'react';

/**
 * Internal dependencies
 */
import type { EditorOptions, FontLoadResult, LoaderError } from '../../types';

export type MonacoEditorProps = {
	className?: string;
	language?: string;
	theme?: string;
	options?: Partial< EditorOptions >;
	value?: string;
	useEmmet?: boolean;
	tabSize?: number;
	insertSpaces?: boolean;
	onChange?: ( value: string, event?: unknown ) => void;
	onFontLoad?: ( result: FontLoadResult ) => void;
	onError?: ( error: LoaderError ) => void;
};

declare const MonacoEditor: ComponentType< MonacoEditorProps >;

export default MonacoEditor;
