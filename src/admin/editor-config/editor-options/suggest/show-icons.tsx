/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function SuggestShowIcons() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Show Icons', 'custom-html-block-extension' ),
				group: __( 'Suggest', 'custom-html-block-extension' ),
				...editorOption( 'suggest', 'showIcons' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether to show or hide icons in suggestions.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/suggest/show-icons_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/suggest/show-icons_2.jpg',
							value: false,
						},
					],
				},
			} }
		/>
	);
}
