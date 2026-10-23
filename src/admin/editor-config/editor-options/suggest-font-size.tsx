/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function SuggestFontSize() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Suggest Font Size (px)', 'custom-html-block-extension' ),
				...editorOption( 'suggestFontSize' ),
				min: 10,
				max: 30,
				defaultValue: 14,
				help: {
					description: __( 'Font size for the suggest widget.', 'custom-html-block-extension' ),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/suggest-font-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/suggest-font-size_2.jpg',
							value: 30,
						},
					],
				},
			} }
		/>
	);
}
