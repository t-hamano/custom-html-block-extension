// Class name of the wrapper of each setting.
export const SETTING_ITEM_CLASS_NAME = 'chbe-admin-editor-config__setting-item';

// Selector of the setting labels the search query is highlighted in.
export const SETTING_LABEL_SELECTOR = `.${ SETTING_ITEM_CLASS_NAME } :is(label, .components-base-control__label)`;

// Name of the CSS custom highlight for the words matching the search query.
export const SEARCH_HIGHLIGHT_NAME = 'chbe-editor-config-search';

/**
 * Case-insensitive patterns for the words in the search query. Unlike
 * lowercasing, the match offsets stay valid for the original text.
 *
 * @param searchQuery Search query.
 */
export function getSearchPatterns( searchQuery: string ): RegExp[] {
	return searchQuery
		.split( /\s+/ )
		.filter( Boolean )
		.map( ( word ) => new RegExp( word.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ), 'giu' ) );
}

/**
 * Whether the text matches every word of the search query.
 *
 * @param searchQuery Search query.
 * @param text        Text to search.
 */
export function matchesSearch( searchQuery: string, text: string ): boolean {
	return getSearchPatterns( searchQuery ).every( ( pattern ) => text.search( pattern ) !== -1 );
}
