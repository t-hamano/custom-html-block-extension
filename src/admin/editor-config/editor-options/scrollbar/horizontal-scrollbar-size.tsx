/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function ScrollbarHorizontalScrollbarSize() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Horizontal Scrollbar Size (px)', 'custom-html-block-extension' ),
				group: __( 'Scrollbar', 'custom-html-block-extension' ),
				...editorOption( 'scrollbar', 'horizontalScrollbarSize' ),
				min: 5,
				max: 30,
				defaultValue: 12,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'The height of the horizontal scrollbar.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/scrollbar/horizontal-scrollbar-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/scrollbar/horizontal-scrollbar-size_2.jpg',
							value: 30,
						},
					],
				},
			} }
		/>
	);
}
