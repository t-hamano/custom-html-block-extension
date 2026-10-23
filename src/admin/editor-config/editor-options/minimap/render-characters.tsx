/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function MinimapRenderCharacters() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Render Characters', 'custom-html-block-extension' ),
				group: __( 'Minimap', 'custom-html-block-extension' ),
				...editorOption( 'minimap', 'renderCharacters' ),
				defaultValue: true,
				help: {
					description: __(
						'Render the actual characters on a line as opposed to color blocks.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							description: __( 'Show characters.', 'custom-html-block-extension' ),
							image: 'editor-options/minimap/render-characters_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							description: __( 'Show blocks.', 'custom-html-block-extension' ),
							image: 'editor-options/minimap/render-characters_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
