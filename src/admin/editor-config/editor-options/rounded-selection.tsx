/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function RoundedSelection() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Rounded Selection', 'custom-html-block-extension' ),
				...editorOption( 'roundedSelection' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether selections should have rounded corners.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/rounded-selection_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/rounded-selection_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
