/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function HideCursorInOverviewRuler() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Hide Cursor In Overview Ruler', 'custom-html-block-extension' ),
				...editorOption( 'hideCursorInOverviewRuler' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether the cursor should be hidden in the overview ruler.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/hide-cursor-in-overview-ruler_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/hide-cursor-in-overview-ruler_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
