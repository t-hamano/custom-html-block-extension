/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function MouseWheelScrollSensitivity() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Mouse Wheel Scroll Sensitivity', 'custom-html-block-extension' ),
				...editorOption( 'mouseWheelScrollSensitivity' ),
				min: 1,
				max: 10,
				defaultValue: 1,
			} }
		/>
	);
}
