/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function CursorSmoothCaretAnimation() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Cursor Smooth Caret Animation', 'custom-html-block-extension' ),
				...editorOption( 'cursorSmoothCaretAnimation' ),
				defaultValue: 'off',
				options: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: 'on',
						image: 'editor-options/cursor-smooth-caret-animation_1.gif',
						description: __(
							'Smooth caret animation is always enabled.',
							'custom-html-block-extension'
						),
					},
					{
						label: __(
							'Enable only when the cursor is moved explicitly',
							'custom-html-block-extension'
						),
						value: 'explicit',
						image: 'editor-options/cursor-smooth-caret-animation_2.gif',
						description: __(
							'Smooth caret animation is enabled only when the user moves the cursor with an explicit gesture.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: 'off',
						image: 'editor-options/cursor-smooth-caret-animation_3.gif',
						description: __( 'Smooth caret animation is disabled.', 'custom-html-block-extension' ),
					},
				],
				help: {
					description: __(
						'Controls whether the smooth caret animation should be enabled.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
