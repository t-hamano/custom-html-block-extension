/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption, selectSetting } from '../../components/setting-item/helpers';

export default function ScrollbarHorizontal() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Horizontal', 'custom-html-block-extension' ),
				group: __( 'Scrollbar', 'custom-html-block-extension' ),
				...editorOption( 'scrollbar', 'horizontal' ),
				defaultValue: 'auto',
				shouldRefreshEditor: true,
				options: [
					{
						label: __( 'Auto', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/horizontal_1.gif',
						value: 'auto',
					},
					{
						label: __( 'Visible', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/horizontal_2.jpg',
						value: 'visible',
					},
					{
						label: __( 'Hidden', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/horizontal_3.jpg',
						value: 'hidden',
					},
				],
				help: {
					description: __(
						'Controls the visibility of the horizontal scrollbar.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
