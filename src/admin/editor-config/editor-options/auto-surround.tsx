/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function AutoSurround() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Auto Surround', 'custom-html-block-extension' ),
				...editorOption( 'autoSurround' ),
				defaultValue: 'languageDefined',
				options: [
					{
						label: __( 'Quotes and brackets', 'custom-html-block-extension' ),
						value: 'languageDefined',
						image: 'editor-options/auto-surround_1.gif',
					},
					{
						label: __( 'Quotes only', 'custom-html-block-extension' ),
						value: 'quotes',
						image: 'editor-options/auto-surround_2.gif',
					},
					{
						label: __( 'Brackets only', 'custom-html-block-extension' ),
						value: 'brackets',
						image: 'editor-options/auto-surround_3.gif',
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/auto-surround_4.gif',
					},
				],
				help: {
					description: __(
						'Controls whether the editor should automatically surround selections when typing quotes or brackets.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ) }
		/>
	);
}
