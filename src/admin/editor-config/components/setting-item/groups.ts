/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export type SettingGroup =
	| 'bracketPairColorization'
	| 'comments'
	| 'find'
	| 'guides'
	| 'hover'
	| 'minimap'
	| 'padding'
	| 'scrollbar'
	| 'stickyScroll'
	| 'suggest'
	| 'unicodeHighlight';

/**
 * Returns the translated name of a setting group. A function rather than a
 * constant, so the strings are translated at render time.
 *
 * @param group Setting group.
 */
export function getGroupLabel( group: SettingGroup ): string {
	switch ( group ) {
		case 'bracketPairColorization':
			return __( 'Bracket Pair Colorization', 'custom-html-block-extension' );
		case 'comments':
			return __( 'Comments', 'custom-html-block-extension' );
		case 'find':
			return __( 'Find', 'custom-html-block-extension' );
		case 'guides':
			return __( 'Guides', 'custom-html-block-extension' );
		case 'hover':
			return __( 'Hover', 'custom-html-block-extension' );
		case 'minimap':
			return __( 'Minimap', 'custom-html-block-extension' );
		case 'padding':
			return __( 'Padding', 'custom-html-block-extension' );
		case 'scrollbar':
			return __( 'Scrollbar', 'custom-html-block-extension' );
		case 'stickyScroll':
			return __( 'Sticky Scroll', 'custom-html-block-extension' );
		case 'suggest':
			return __( 'Suggest', 'custom-html-block-extension' );
		case 'unicodeHighlight':
			return __( 'Unicode Highlight', 'custom-html-block-extension' );
	}
}
