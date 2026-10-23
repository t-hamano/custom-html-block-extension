/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function FontSize() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Font Size (px)', 'custom-html-block-extension' ),
				...editorOption( 'fontSize' ),
				min: 10,
				max: 30,
				defaultValue: 14,
			} }
		/>
	);
}
