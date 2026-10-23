/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption, selectSetting } from '../../components/setting-item/helpers';

export default function MinimapShowSlider() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Show Slider', 'custom-html-block-extension' ),
				group: __( 'Minimap', 'custom-html-block-extension' ),
				...editorOption( 'minimap', 'showSlider' ),
				defaultValue: 'mouseover',
				options: [
					{
						label: __( 'Always show', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/minimap/show-slider_1.jpg',
					},
					{
						label: __( 'Show on mouseover', 'custom-html-block-extension' ),
						value: 'mouseover',
						image: 'editor-options/minimap/show-slider_2.gif',
					},
				],
				help: {
					description: __(
						'Controls when the minimap slider is shown.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ) }
		/>
	);
}
