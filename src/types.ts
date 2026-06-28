/**
 * External dependencies
 */
import type { Dispatch, SetStateAction } from 'react';

/**
 * Editor settings stored separately from the raw monaco options.
 */
export type EditorSettings = {
	theme: string;
	tabSize: number;
	insertSpaces: boolean;
	emmet: boolean;
};

/**
 * Editor options. This mirrors the shape persisted in `chbeObj.editorOptions`
 * and passed (after casting) to `monaco.editor.create`. Select-based options are
 * stored as strings, toggle-based options as booleans, and range-based options as
 * numbers, matching the controls in `editor-config/editor-options`.
 */
export type EditorOptions = {
	acceptSuggestionOnEnter: boolean;
	autoClosingBrackets: string;
	autoClosingQuotes: string;
	autoIndent: string;
	autoSurround: string;
	columnSelection: boolean;
	comments: {
		insertSpace: boolean;
	};
	contextmenu: boolean;
	copyWithSyntaxHighlighting: boolean;
	cursorBlinking: string;
	cursorSmoothCaretAnimation: boolean;
	cursorStyle: string;
	cursorSurroundingLines: number;
	cursorSurroundingLinesStyle: string;
	cursorWidth: number;
	dragAndDrop: boolean;
	emptySelectionClipboard: boolean;
	fastScrollSensitivity: number;
	find: {
		addExtraSpaceOnTop: boolean;
		loop: boolean;
		seedSearchStringFromSelection: boolean;
	};
	folding: boolean;
	foldingHighlight: boolean;
	foldingStrategy: string;
	fontFamily: string;
	fontLigatures: boolean;
	fontSize: number;
	fontWeight: string;
	formatOnPaste: boolean;
	glyphMargin: boolean;
	hideCursorInOverviewRuler: boolean;
	highlightActiveIndentGuide: boolean;
	hover: boolean;
	letterSpacing: number;
	lineDecorationsWidth: number;
	lineHeight: number;
	lineNumbers: string;
	lineNumbersMinChars: number;
	links: boolean;
	matchBrackets: string;
	minimap: {
		enabled: boolean;
		maxColumn: number;
		renderCharacters: boolean;
		scale: number;
		showSlider: string;
		side: string;
		size: string;
	};
	mouseWheelScrollSensitivity: number;
	mouseWheelZoom: boolean;
	multiCursorModifier: string;
	multiCursorPaste: string;
	occurrencesHighlight: boolean;
	overviewRulerBorder: boolean;
	padding: {
		bottom: number;
		top: number;
	};
	quickSuggestions: boolean;
	quickSuggestionsDelay: number;
	suggestOnTriggerCharacters: boolean;
	renderControlCharacters: boolean;
	renderFinalNewline: boolean;
	renderIndentGuides: boolean;
	renderLineHighlight: string;
	renderLineHighlightOnlyWhenFocus: boolean;
	renderWhitespace: string;
	roundedSelection: boolean;
	rulers: number[];
	scrollBeyondLastColumn: number;
	scrollBeyondLastLine: boolean;
	scrollbar: {
		alwaysConsumeMouseWheel: boolean;
		arrowSize: number;
		horizontal: string;
		horizontalHasArrows: boolean;
		horizontalScrollbarSize: number;
		scrollByPage: boolean;
		useShadows: boolean;
		vertical: string;
		verticalHasArrows: boolean;
		verticalScrollbarSize: number;
	};
	selectOnLineNumbers: boolean;
	selectionHighlight: boolean;
	showFoldingControls: string;
	smoothScrolling: boolean;
	stickyTabStops: boolean;
	suggest: {
		showIcons: boolean;
	};
	suggestFontSize: number;
	suggestLineHeight: number;
	unfoldOnClickAfterEndOfLine: boolean;
	useTabStops: boolean;
	wordWrap: string;
	wordWrapColumn: number;
	wrappingIndent: string;
};

/**
 * Permission/role options.
 */
export type Options = {
	permissionBlockEditor: boolean;
	permissionClassicEditor: boolean;
	permissionThemePluginEditor: boolean;
	permissionRoles: string[];
};

/**
 * A selectable font family registered via `chbeObj.fontFamily`.
 */
export type FontFamily = {
	name: string;
	label?: string;
	weight?: number[];
	stylesheet?: string;
};

/**
 * Value provided by `AdminContext`.
 */
export type AdminContextType = {
	code: string;
	isWaiting: boolean;
	editorSettings: EditorSettings;
	editorOptions: EditorOptions;
	options: Options;
	setCode: Dispatch< SetStateAction< string > >;
	setIsWaiting: Dispatch< SetStateAction< boolean > >;
	setEditorOptions: Dispatch< SetStateAction< EditorOptions > >;
	setEditorSettings: Dispatch< SetStateAction< EditorSettings > >;
	setOptions: Dispatch< SetStateAction< Options > >;
};

/**
 * Value provided by `EditorConfigContext`.
 */
export type EditorConfigContextType = {
	onRefreshEditor: () => void;
	searchQuery: string;
};

/**
 * Payload passed to `MonacoEditor`'s `onFontLoad` callback.
 */
export type FontLoadResult = {
	isSuccess: boolean;
	font: FontFamily;
};
