/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function ScrollbarVerticalScrollbarSize() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Vertical Scrollbar Size (px)', 'custom-html-block-extension' ),
				group: __( 'Scrollbar', 'custom-html-block-extension' ),
				...editorOption( 'scrollbar', 'verticalScrollbarSize' ),
				min: 5,
				max: 30,
				defaultValue: 14,
				shouldRefreshEditor: true,
				help: {
					description: __( 'The width of the vertical scrollbar.', 'custom-html-block-extension' ),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/scrollbar/vertical-scrollbar-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/scrollbar/vertical-scrollbar-size_2.jpg',
							value: 30,
						},
					],
				},
			} }
		/>
	);
}
