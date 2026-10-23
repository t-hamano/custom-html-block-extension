/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function PaddingTop() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Top (px)', 'custom-html-block-extension' ),
				group: __( 'Padding', 'custom-html-block-extension' ),
				...editorOption( 'padding', 'top' ),
				min: 0,
				max: 50,
				defaultValue: 0,
				help: {
					description: __(
						'Controls the amount of space between the top edge of the editor and the first line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/padding/top.gif',
				},
			} }
		/>
	);
}
