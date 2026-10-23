/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption, selectSetting } from '../../components/setting-item/helpers';

export default function MinimapAutohide() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Autohide', 'custom-html-block-extension' ),
				group: __( 'Minimap', 'custom-html-block-extension' ),
				...editorOption( 'minimap', 'autohide' ),
				defaultValue: 'none',
				options: [
					{
						label: __( "Don't hide", 'custom-html-block-extension' ),
						value: 'none',
						image: 'editor-options/minimap/autohide_1.jpg',
						description: __( 'The minimap is always shown.', 'custom-html-block-extension' ),
					},
					{
						label: __( 'Show on mouseover', 'custom-html-block-extension' ),
						value: 'mouseover',
						image: 'editor-options/minimap/autohide_2.gif',
						description: __(
							'The minimap is hidden when mouse is not over the minimap and shown when mouse is over the minimap.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Show while scrolling', 'custom-html-block-extension' ),
						value: 'scroll',
						image: 'editor-options/minimap/autohide_3.gif',
						description: __(
							'The minimap is only shown when the editor is scrolled.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether the minimap is hidden automatically.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
