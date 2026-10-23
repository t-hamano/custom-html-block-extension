/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function UseTabStops() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Use Tab Stops', 'custom-html-block-extension' ),
				...editorOption( 'useTabStops' ),
				defaultValue: true,
				help: {
					description: __(
						'Spaces and tabs are inserted and deleted in alignment with tab stops.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/use-tab-stops_1.gif',
							description: __(
								'Indenting with Tab aligns to the next tab stop, and Backspace within the indentation deletes back to the previous tab stop.',
								'custom-html-block-extension'
							),
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/use-tab-stops_2.gif',
							description: __(
								'Indenting with Tab always adds a full Tab Size of indentation, and Backspace deletes one character at a time.',
								'custom-html-block-extension'
							),
							value: false,
						},
					],
				},
			} }
		/>
	);
}
