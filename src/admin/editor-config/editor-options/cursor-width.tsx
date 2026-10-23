/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function CursorWidth() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Cursor Width (px)', 'custom-html-block-extension' ),
				...editorOption( 'cursorWidth' ),
				min: 2,
				max: 10,
				defaultValue: 2,
			} }
		/>
	);
}
