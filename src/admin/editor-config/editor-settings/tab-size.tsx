/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorSetting } from '../components/setting-item/helpers';

export default function TabSize() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Tab Size', 'custom-html-block-extension' ),
				...editorSetting( 'tabSize' ),
				min: 1,
				max: 8,
				defaultValue: 4,
			} }
		/>
	);
}
