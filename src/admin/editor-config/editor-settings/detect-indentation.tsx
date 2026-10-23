/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorSetting } from '../components/setting-item/helpers';

export default function DetectIndentation() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Detect Indentation', 'custom-html-block-extension' ),
				...editorSetting( 'detectIndentation' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether "Tab Size" and "Insert Spaces" will be automatically detected when a file is opened based on the file contents.',
						'custom-html-block-extension'
					),
				},
			} }
		/>
	);
}
