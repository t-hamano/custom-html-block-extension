/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function MinimapEnabled() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Minimap', 'custom-html-block-extension' ),
				group: __( 'Minimap', 'custom-html-block-extension' ),
				...editorOption( 'minimap', 'enabled' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the minimap is shown.',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/enabled.gif',
				},
			} }
		/>
	);
}
