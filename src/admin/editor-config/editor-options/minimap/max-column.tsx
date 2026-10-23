/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function MinimapMaxColumn() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Max Column', 'custom-html-block-extension' ),
				group: __( 'Minimap', 'custom-html-block-extension' ),
				...editorOption( 'minimap', 'maxColumn' ),
				min: 10,
				max: 60,
				defaultValue: 60,
				help: {
					description: __(
						'Limit the width of the minimap to render at most a certain number of columns.',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/max-column.gif',
				},
			} }
		/>
	);
}
