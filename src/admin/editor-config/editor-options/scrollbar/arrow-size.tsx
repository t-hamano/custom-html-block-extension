/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function ScrollbarArrowSize() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Arrow Size (px)', 'custom-html-block-extension' ),
				group: __( 'Scrollbar', 'custom-html-block-extension' ),
				...editorOption( 'scrollbar', 'arrowSize' ),
				min: 5,
				max: 50,
				defaultValue: 11,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls the size of the scrollbar arrows.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/scrollbar/arrow-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/scrollbar/arrow-size_2.jpg',
							value: 30,
						},
					],
				},
			} }
		/>
	);
}
