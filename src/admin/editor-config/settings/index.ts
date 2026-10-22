/**
 * Internal dependencies
 */
import getEditorPanel from './panels/editor';
import getFontPanel from './panels/font';
import getWordWrapPanel from './panels/word-wrap';
import getMinimapPanel from './panels/minimap';
import getCursorPanel from './panels/cursor';
import getCodeFoldingPanel from './panels/code-folding';
import getLineNumberPanel from './panels/line-number';
import getSuggestPanel from './panels/suggest';
import getAutoCompletionPanel from './panels/auto-completion';
import getMouseAndScrollPanel from './panels/mouse-and-scroll';
import getSelectionPanel from './panels/selection';
import getHighlightAndRenderingPanel from './panels/highlight-and-rendering';
import getFindPanel from './panels/find';
import getScrollbarPanel from './panels/scrollbar';
import getOtherPanel from './panels/other';
import type { SettingDefinition, SettingPanel } from './types';

/**
 * Returns the panels of the Advanced mode. The definitions are created when
 * called, so translations and platform checks are evaluated at render time.
 */
export function getSettingPanels(): SettingPanel[] {
	return [
		getEditorPanel(),
		getFontPanel(),
		getWordWrapPanel(),
		getMinimapPanel(),
		getCursorPanel(),
		getCodeFoldingPanel(),
		getLineNumberPanel(),
		getSuggestPanel(),
		getAutoCompletionPanel(),
		getMouseAndScrollPanel(),
		getSelectionPanel(),
		getHighlightAndRenderingPanel(),
		getFindPanel(),
		getScrollbarPanel(),
		getOtherPanel(),
	];
}

// IDs of the settings shown in the Basic mode, in display order.
export const BASIC_SETTING_IDS = [
	'theme',
	'tabSize',
	'insertSpaces',
	'detectIndentation',
	'emmet',
	'fontFamily',
	'fontWeight',
	'fontSize',
	'lineHeight',
	'wordWrap',
	'lineNumbers',
	'renderWhitespace',
	'minimap.enabled',
	'folding',
	'cursorStyle',
	'autoIndent',
	'autoClosingBrackets',
	'autoClosingQuotes',
	'quickSuggestions',
];

/**
 * Returns the settings of the Basic mode from the same definitions as the
 * Advanced mode.
 *
 * @param panels Panels of the Advanced mode.
 */
export function getBasicSettings( panels: SettingPanel[] ): SettingDefinition[] {
	const settings = panels.flatMap( ( panel ) => panel.settings );
	return BASIC_SETTING_IDS.map( ( id ) =>
		settings.find( ( setting ) => setting.id === id )
	).filter( ( setting ): setting is SettingDefinition => !! setting );
}

export type { SettingDefinition, SettingPanel } from './types';
