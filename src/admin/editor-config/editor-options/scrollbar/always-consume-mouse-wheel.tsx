/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function ScrollbarAlwaysConsumeMouseWheel() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Always Consume Mouse Wheel', 'custom-html-block-extension' ),
				group: __( 'Scrollbar', 'custom-html-block-extension' ),
				...editorOption( 'scrollbar', 'alwaysConsumeMouseWheel' ),
				defaultValue: true,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls whether the editor keeps mouse wheel scrolling to itself, instead of passing it on to the page.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							description: __(
								'The page does not scroll, even when the editor is scrolled to the top or bottom.',
								'custom-html-block-extension'
							),
							image: 'editor-options/scrollbar/always-consume-mouse-wheel_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							description: __(
								'The page scrolls when the editor is scrolled to the top or bottom.',
								'custom-html-block-extension'
							),
							image: 'editor-options/scrollbar/always-consume-mouse-wheel_2.gif',
						},
					],
				},
			} }
		/>
	);
}
