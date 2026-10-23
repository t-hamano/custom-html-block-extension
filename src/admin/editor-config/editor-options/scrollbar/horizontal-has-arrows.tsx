/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function ScrollbarHorizontalHasArrows() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Horizontal Has Arrows', 'custom-html-block-extension' ),
				group: __( 'Scrollbar', 'custom-html-block-extension' ),
				...editorOption( 'scrollbar', 'horizontalHasArrows' ),
				defaultValue: false,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls whether arrows are rendered at the left and right of the horizontal scrollbar.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/horizontal-has-arrows_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/horizontal-has-arrows_2.jpg',
							value: false,
						},
					],
				},
			} }
		/>
	);
}
