/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function MultiCursorModifier() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'toggleGroup',
				label: __( 'Multi Cursor Modifier', 'custom-html-block-extension' ),
				...editorOption( 'multiCursorModifier' ),
				defaultValue: 'alt',
				options: [
					{
						label: isAppleOS()
							? __( 'Option', 'custom-html-block-extension' )
							: __( 'Alt', 'custom-html-block-extension' ),
						value: 'alt',
					},
					{
						label: isAppleOS()
							? __( 'Command', 'custom-html-block-extension' )
							: __( 'Ctrl', 'custom-html-block-extension' ),
						value: 'ctrlCmd',
					},
				],
				help: {
					description: __(
						'The modifier to be used to add multiple cursors with the mouse.',
						'custom-html-block-extension'
					),
					image: 'editor-options/multi-cursor-modifier.gif',
				},
			} ) }
		/>
	);
}
