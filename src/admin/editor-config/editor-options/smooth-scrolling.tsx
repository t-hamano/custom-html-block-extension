/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function SmoothScrolling() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Smooth Scrolling', 'custom-html-block-extension' ),
				...editorOption( 'smoothScrolling' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether the editor will scroll using an animation.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/smooth-scrolling_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/smooth-scrolling_2.gif',
						},
					],
				},
			} }
		/>
	);
}
