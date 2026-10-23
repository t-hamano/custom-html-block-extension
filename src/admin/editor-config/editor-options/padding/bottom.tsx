/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function PaddingBottom() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Bottom (px)', 'custom-html-block-extension' ),
				group: __( 'Padding', 'custom-html-block-extension' ),
				...editorOption( 'padding', 'bottom' ),
				min: 0,
				max: 50,
				defaultValue: 0,
				help: {
					description: __(
						'Controls the amount of space between the bottom edge of the editor and the last line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/padding/bottom.gif',
				},
			} }
		/>
	);
}
