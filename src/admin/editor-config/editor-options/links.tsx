/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function Links() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Clickable Links', 'custom-html-block-extension' ),
				...editorOption( 'links' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should detect links and make them clickable.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/links_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/links_2.jpg',
							value: false,
						},
					],
				},
			} }
		/>
	);
}
