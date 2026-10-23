/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function HoverAbove() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Prefer Hover Above', 'custom-html-block-extension' ),
				group: __( 'Hover', 'custom-html-block-extension' ),
				...editorOption( 'hover', 'above' ),
				defaultValue: true,
				help: {
					description: __(
						"Prefer showing hovers above the line, if there's space.",
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/hover/above_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/hover/above_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
