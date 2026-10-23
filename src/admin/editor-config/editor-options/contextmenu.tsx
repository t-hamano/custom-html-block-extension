/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function Contextmenu() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Context Menu', 'custom-html-block-extension' ),
				...editorOption( 'contextmenu' ),
				defaultValue: true,
				help: {
					description: __( 'Enable custom context menu.', 'custom-html-block-extension' ),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/contextmenu_1.jpg',
							description: __( 'Show the editor context menu.', 'custom-html-block-extension' ),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/contextmenu_2.jpg',
							description: __( 'Show the browser context menu.', 'custom-html-block-extension' ),
						},
					],
				},
			} }
		/>
	);
}
