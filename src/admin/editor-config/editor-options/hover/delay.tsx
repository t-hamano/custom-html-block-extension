/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function HoverDelay() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Hover Delay (ms)', 'custom-html-block-extension' ),
				group: __( 'Hover', 'custom-html-block-extension' ),
				...editorOption( 'hover', 'delay' ),
				min: 0,
				max: 3000,
				step: 50,
				defaultValue: 300,
				help: {
					description: __(
						'Controls the delay in milliseconds after which the hover is shown.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'300'
							),
							image: 'editor-options/hover/delay_1.gif',
							value: 300,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'1500'
							),
							image: 'editor-options/hover/delay_2.gif',
							value: 1500,
						},
					],
				},
			} }
		/>
	);
}
