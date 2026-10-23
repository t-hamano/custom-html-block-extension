/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function AutoClosingDelete() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Auto Closing Delete', 'custom-html-block-extension' ),
				...editorOption( 'autoClosingDelete' ),
				defaultValue: 'auto',
				options: [
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/auto-closing-delete_1.gif',
						description: __(
							'Always remove adjacent closing quotes or brackets when deleting.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
						value: 'auto',
						image: 'editor-options/auto-closing-delete_2.gif',
						description: __(
							'Remove adjacent closing quotes or brackets only if they were automatically inserted.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/auto-closing-delete_3.gif',
						description: __(
							'Never remove adjacent closing quotes or brackets when deleting.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether the editor should remove adjacent closing quotes or brackets when deleting.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
