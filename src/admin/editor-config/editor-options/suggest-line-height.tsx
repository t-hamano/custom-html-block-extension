/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function SuggestLineHeight() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Suggest Line Height (px)', 'custom-html-block-extension' ),
				...editorOption( 'suggestLineHeight' ),
				min: 10,
				max: 60,
				defaultValue: 21,
				help: {
					description: __( 'Line height for the suggest widget.', 'custom-html-block-extension' ),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/suggest-line-height_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/suggest-line-height_2.jpg',
							value: 30,
						},
					],
				},
			} }
		/>
	);
}
