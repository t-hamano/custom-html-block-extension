/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function MultiCursorPaste() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'toggleGroup',
				label: __( 'Multi Cursor Paste', 'custom-html-block-extension' ),
				...editorOption( 'multiCursorPaste' ),
				defaultValue: 'spread',
				options: [
					{
						label: __( 'Spread', 'custom-html-block-extension' ),
						image: 'editor-options/multi-cursor-paste_1.gif',
						value: 'spread',
						description: __(
							'Each cursor pastes a single line of the text.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Full', 'custom-html-block-extension' ),
						image: 'editor-options/multi-cursor-paste_2.gif',
						value: 'full',
						description: __( 'Each cursor pastes the full text.', 'custom-html-block-extension' ),
					},
				],
				help: {
					description: __(
						'Controls pasting when the line count of the pasted text matches the cursor count.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ) }
		/>
	);
}
