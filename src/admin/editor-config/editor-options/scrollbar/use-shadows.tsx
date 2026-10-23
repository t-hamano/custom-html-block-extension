/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function ScrollbarUseShadows() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Use Shadows', 'custom-html-block-extension' ),
				group: __( 'Scrollbar', 'custom-html-block-extension' ),
				...editorOption( 'scrollbar', 'useShadows' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether horizontal and vertical shadows are cast when the content is scrolled.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/use-shadows_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/use-shadows_2.jpg',
							value: false,
						},
					],
				},
			} }
		/>
	);
}
