/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function SelectOnLineNumbers() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Select On Line Numbers', 'custom-html-block-extension' ),
				...editorOption( 'selectOnLineNumbers' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the corresponding line is selected when clicking on the line number.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/select-on-line-numbers_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/select-on-line-numbers_2.gif',
						},
					],
				},
			} }
		/>
	);
}
