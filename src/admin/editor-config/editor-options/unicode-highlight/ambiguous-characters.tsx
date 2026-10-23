/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function UnicodeHighlightAmbiguousCharacters() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Ambiguous Characters', 'custom-html-block-extension' ),
				group: __( 'Unicode Highlight', 'custom-html-block-extension' ),
				...editorOption( 'unicodeHighlight', 'ambiguousCharacters' ),
				defaultValue: true,
				help: {
					description: (
						<Text render={ <p /> }>
							{ createInterpolateElement(
								__(
									"Characters that look like common ASCII characters, such as the curly quote <code>‘</code> that looks like the straight quote <code>'</code>, are surrounded by a border.",
									'custom-html-block-extension'
								),
								{
									code: <code />,
								}
							) }
						</Text>
					),
					image: 'editor-options/unicode-highlight/ambiguous-characters.jpg',
				},
			} }
		/>
	);
}
