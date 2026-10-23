/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption, selectSetting } from '../../components/setting-item/helpers';

export default function SuggestInsertMode() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Insert Mode', 'custom-html-block-extension' ),
				group: __( 'Suggest', 'custom-html-block-extension' ),
				...editorOption( 'suggest', 'insertMode' ),
				defaultValue: 'insert',
				options: [
					{
						label: __( 'Insert', 'custom-html-block-extension' ),
						value: 'insert',
						image: 'editor-options/suggest/insert-mode_1.gif',
						description: __(
							'Insert suggestion without overwriting text right of the cursor.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Replace', 'custom-html-block-extension' ),
						value: 'replace',
						image: 'editor-options/suggest/insert-mode_2.gif',
						description: __(
							'Insert suggestion and overwrite text right of the cursor.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether words are overwritten when accepting completions.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 2,
				},
			} ) }
		/>
	);
}
