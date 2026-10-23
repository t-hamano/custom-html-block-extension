/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function UnicodeHighlightNonBasicAscii() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Non Basic ASCII', 'custom-html-block-extension' ),
				group: __( 'Unicode Highlight', 'custom-html-block-extension' ),
				...editorOption( 'unicodeHighlight', 'nonBasicASCII' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether all non-basic ASCII characters are highlighted. Only characters between U+0020 and U+007E, tab, line-feed and carriage-return are considered basic ASCII.',
						'custom-html-block-extension'
					),
					image: 'editor-options/unicode-highlight/non-basic-ascii.jpg',
				},
			} }
		/>
	);
}
