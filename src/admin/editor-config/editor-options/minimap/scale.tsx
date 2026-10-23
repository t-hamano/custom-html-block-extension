/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function MinimapScale() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Scale', 'custom-html-block-extension' ),
				group: __( 'Minimap', 'custom-html-block-extension' ),
				...editorOption( 'minimap', 'scale' ),
				min: 1,
				max: 3,
				defaultValue: 1,
				help: {
					description: __(
						'Scale of content drawn in the minimap.',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/scale.gif',
				},
			} }
		/>
	);
}
