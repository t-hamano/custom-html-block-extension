/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function UnicodeHighlightInvisibleCharacters() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Invisible Characters', 'custom-html-block-extension' ),
				group: __( 'Unicode Highlight', 'custom-html-block-extension' ),
				...editorOption( 'unicodeHighlight', 'invisibleCharacters' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether characters that just reserve space or have no width at all are highlighted.',
						'custom-html-block-extension'
					),
					image: 'editor-options/unicode-highlight/invisible-characters.jpg',
				},
			} }
		/>
	);
}
