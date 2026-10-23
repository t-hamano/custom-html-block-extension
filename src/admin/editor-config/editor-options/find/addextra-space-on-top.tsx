/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function FindAddExtraSpaceOnTop() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Add Extra Space On Top', 'custom-html-block-extension' ),
				group: __( 'Find', 'custom-html-block-extension' ),
				...editorOption( 'find', 'addExtraSpaceOnTop' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the Find Widget should add extra lines on top of the editor.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/find/addextra-space-on-top_1.jpg',
							description: __(
								'While the find widget is open, extra space is added above the first line so the widget does not cover it.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/find/addextra-space-on-top_2.jpg',
							description: __(
								'No extra space is added, so the find widget may cover the first lines.',
								'custom-html-block-extension'
							),
						},
					],
				},
			} }
		/>
	);
}
