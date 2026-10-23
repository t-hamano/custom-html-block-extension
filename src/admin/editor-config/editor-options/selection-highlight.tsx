/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function SelectionHighlight() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Selection Highlight', 'custom-html-block-extension' ),
				...editorOption( 'selectionHighlight' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should highlight matches similar to the selection.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/selection-highlight_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/selection-highlight_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
