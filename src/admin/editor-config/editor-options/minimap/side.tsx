/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption, selectSetting } from '../../components/setting-item/helpers';

export default function MinimapSide() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'toggleGroup',
				label: __( 'Side', 'custom-html-block-extension' ),
				group: __( 'Minimap', 'custom-html-block-extension' ),
				...editorOption( 'minimap', 'side' ),
				defaultValue: 'right',
				options: [
					{
						label: __( 'Left', 'custom-html-block-extension' ),
						image: 'editor-options/minimap/side_1.jpg',
						value: 'left',
					},
					{
						label: __( 'Right', 'custom-html-block-extension' ),
						image: 'editor-options/minimap/side_2.jpg',
						value: 'right',
					},
				],
				help: {
					description: __(
						'Controls the side where to render the minimap.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ) }
		/>
	);
}
