/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function CursorBlinking() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Cursor Blinking', 'custom-html-block-extension' ),
				...editorOption( 'cursorBlinking' ),
				defaultValue: 'blink',
				options: [
					{
						label: __( 'Blink', 'custom-html-block-extension' ),
						value: 'blink',
						image: 'editor-options/cursor-blinking_1.gif',
					},
					{
						label: __( 'Smooth', 'custom-html-block-extension' ),
						value: 'smooth',
						image: 'editor-options/cursor-blinking_2.gif',
					},
					{
						label: __( 'Phase', 'custom-html-block-extension' ),
						value: 'phase',
						image: 'editor-options/cursor-blinking_3.gif',
					},
					{
						label: __( 'Expand', 'custom-html-block-extension' ),
						value: 'expand',
						image: 'editor-options/cursor-blinking_4.gif',
					},
					{
						label: __( 'Solid', 'custom-html-block-extension' ),
						value: 'solid',
						image: 'editor-options/cursor-blinking_5.jpg',
					},
				],
				help: {
					description: __( 'Controls the cursor animation style.', 'custom-html-block-extension' ),
					showOptions: true,
					colCount: 5,
				},
			} ) }
		/>
	);
}
