/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function FastScrollSensitivity() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Fast Scroll Sensitivity', 'custom-html-block-extension' ),
				...editorOption( 'fastScrollSensitivity' ),
				min: 1,
				max: 10,
				defaultValue: 5,
			} }
		/>
	);
}
