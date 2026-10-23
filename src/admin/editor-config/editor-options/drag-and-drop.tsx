/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function DragAndDrop() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Drag And Drop', 'custom-html-block-extension' ),
				...editorOption( 'dragAndDrop' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should allow moving selections via drag and drop.',
						'custom-html-block-extension'
					),
					image: 'editor-options/drag-and-drop.gif',
				},
			} }
		/>
	);
}
