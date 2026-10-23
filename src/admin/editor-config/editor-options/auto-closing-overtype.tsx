/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function AutoClosingOvertype() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Auto Closing Overtype', 'custom-html-block-extension' ),
				...editorOption( 'autoClosingOvertype' ),
				defaultValue: 'auto',
				options: [
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/auto-closing-overtype_1.gif',
						description: __(
							'Always type over closing quotes or brackets.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
						value: 'auto',
						image: 'editor-options/auto-closing-overtype_2.gif',
						description: __(
							'Type over closing quotes or brackets only if they were automatically inserted.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/auto-closing-overtype_3.gif',
						description: __(
							'Never type over closing quotes or brackets.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether the editor should type over closing quotes or brackets.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
