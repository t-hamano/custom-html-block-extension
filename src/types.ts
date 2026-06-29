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
 * Editor options persisted in `chbeObj.editorOptions` and passed (after
 * casting) to `monaco.editor.create`.
 */
export type EditorOptions = {
	acceptSuggestionOnEnter: 'on' | 'smart' | 'off';
	autoClosingBrackets: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
	autoClosingQuotes: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
	autoIndent: 'none' | 'keep' | 'brackets' | 'advanced' | 'full';
	autoSurround: 'languageDefined' | 'quotes' | 'brackets' | 'never';
	columnSelection: boolean;
	comments: {
		insertSpace: boolean;
	};
	contextmenu: boolean;
	copyWithSyntaxHighlighting: boolean;
	cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
	cursorSmoothCaretAnimation: 'off' | 'explicit' | 'on';
	cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
	cursorSurroundingLines: number;
	cursorSurroundingLinesStyle: 'default' | 'all';
	cursorWidth: number;
	dragAndDrop: boolean;
	emptySelectionClipboard: boolean;
	fastScrollSensitivity: number;
	find: {
		addExtraSpaceOnTop: boolean;
		loop: boolean;
		seedSearchStringFromSelection: 'never' | 'always' | 'selection';
	};
	folding: boolean;
	foldingHighlight: boolean;
	foldingStrategy: 'auto' | 'indentation';
	fontFamily: string;
	fontLigatures: boolean;
	fontSize: number;
	fontWeight: string;
	formatOnPaste: boolean;
	glyphMargin: boolean;
	hideCursorInOverviewRuler: boolean;
	highlightActiveIndentGuide: boolean;
	hover: {
		enabled: boolean;
	};
	letterSpacing: number;
	lineDecorationsWidth: number;
	lineHeight: number;
	// monaco also allows a `(lineNumber: number) => string` formatter, but the
	// plugin only exposes the preset modes.
	lineNumbers: 'on' | 'off' | 'relative' | 'interval';
	lineNumbersMinChars: number;
	links: boolean;
	matchBrackets: 'never' | 'near' | 'always';
	minimap: {
		enabled: boolean;
		maxColumn: number;
		renderCharacters: boolean;
		scale: number;
		showSlider: 'always' | 'mouseover';
		side: 'right' | 'left';
		size: 'proportional' | 'fill' | 'fit';
	};
	mouseWheelScrollSensitivity: number;
	mouseWheelZoom: boolean;
	multiCursorModifier: 'ctrlCmd' | 'alt';
	multiCursorPaste: 'spread' | 'full';
	occurrencesHighlight: 'off' | 'singleFile' | 'multiFile';
	overviewRulerBorder: boolean;
	padding: {
		bottom: number;
		top: number;
	};
	quickSuggestions: boolean;
	quickSuggestionsDelay: number;
	suggestOnTriggerCharacters: boolean;
	renderControlCharacters: boolean;
	renderFinalNewline: 'on' | 'off' | 'dimmed';
	renderIndentGuides: boolean;
	renderLineHighlight: 'none' | 'gutter' | 'line' | 'all';
	renderLineHighlightOnlyWhenFocus: boolean;
	renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
	roundedSelection: boolean;
	rulers: number[];
	scrollBeyondLastColumn: number;
	scrollBeyondLastLine: boolean;
	scrollbar: {
		alwaysConsumeMouseWheel: boolean;
		arrowSize: number;
		horizontal: 'auto' | 'visible' | 'hidden';
		horizontalHasArrows: boolean;
		horizontalScrollbarSize: number;
		scrollByPage: boolean;
		useShadows: boolean;
		vertical: 'auto' | 'visible' | 'hidden';
		verticalHasArrows: boolean;
		verticalScrollbarSize: number;
	};
	selectOnLineNumbers: boolean;
	selectionHighlight: boolean;
	showFoldingControls: 'always' | 'never' | 'mouseover';
	smoothScrolling: boolean;
	stickyTabStops: boolean;
	suggest: {
		showIcons: boolean;
	};
	suggestFontSize: number;
	suggestLineHeight: number;
	unfoldOnClickAfterEndOfLine: boolean;
	useTabStops: boolean;
	wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
	wordWrapColumn: number;
	wrappingIndent: 'none' | 'same' | 'indent' | 'deepIndent';
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
