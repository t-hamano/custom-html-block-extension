/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import themes from '../../../lib/themes';
import SettingItem from '../components/setting-item';
import { editorSetting, selectSetting } from '../components/setting-item/helpers';

export default function Theme() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Theme', 'custom-html-block-extension' ),
				...editorSetting( 'theme' ),
				options: [
					{ label: __( 'Visual Studio Dark', 'custom-html-block-extension' ), value: 'vs-dark' },
					{ label: __( 'Light', 'custom-html-block-extension' ), value: 'light' },
					...themes,
				],
			} ) }
		/>
	);
}
