/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function LineHeight() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Line Height', 'custom-html-block-extension' ),
				...editorOption( 'lineHeight' ),
				min: 0,
				max: 60,
				step: 0.1,
				defaultValue: 21,
				controlHelp: __(
					'0 computes the line height from the font size. Values less than 8 are a multiplier of the font size. Values of 8 or more are pixels.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
