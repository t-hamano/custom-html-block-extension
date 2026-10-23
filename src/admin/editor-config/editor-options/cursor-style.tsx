/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function CursorStyle() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Cursor Style', 'custom-html-block-extension' ),
				...editorOption( 'cursorStyle' ),
				defaultValue: 'line',
				options: [
					{
						label: __( 'Line', 'custom-html-block-extension' ),
						value: 'line',
						image: 'editor-options/cursor-style_1.jpg',
					},
					{
						label: __( 'Thin line', 'custom-html-block-extension' ),
						value: 'line-thin',
						image: 'editor-options/cursor-style_2.jpg',
					},
					{
						label: __( 'Block', 'custom-html-block-extension' ),
						value: 'block',
						image: 'editor-options/cursor-style_3.jpg',
					},
					{
						label: __( 'Outline', 'custom-html-block-extension' ),
						value: 'block-outline',
						image: 'editor-options/cursor-style_4.jpg',
					},
					{
						label: __( 'Underline', 'custom-html-block-extension' ),
						value: 'underline',
						image: 'editor-options/cursor-style_5.jpg',
					},
					{
						label: __( 'Thin underline', 'custom-html-block-extension' ),
						value: 'underline-thin',
						image: 'editor-options/cursor-style_6.jpg',
					},
				],
				help: {
					description: __( 'Controls the cursor style.', 'custom-html-block-extension' ),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
