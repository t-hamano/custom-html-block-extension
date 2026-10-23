/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function LetterSpacing() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Letter Spacing (px)', 'custom-html-block-extension' ),
				...editorOption( 'letterSpacing' ),
				min: -2,
				max: 2,
				step: 0.1,
				defaultValue: 0,
			} }
		/>
	);
}
