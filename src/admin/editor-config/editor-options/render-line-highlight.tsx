/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function RenderLineHighlight() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Render Line Highlight', 'custom-html-block-extension' ),
				...editorOption( 'renderLineHighlight' ),
				defaultValue: 'line',
				options: [
					{
						label: __( 'Line numbers and the editor content', 'custom-html-block-extension' ),
						value: 'all',
						image: 'editor-options/render-line-highlight_1.jpg',
					},
					{
						label: __( 'Only the editor content', 'custom-html-block-extension' ),
						value: 'line',
						image: 'editor-options/render-line-highlight_2.jpg',
					},
					{
						label: __( 'Only line numbers', 'custom-html-block-extension' ),
						value: 'gutter',
						image: 'editor-options/render-line-highlight_3.jpg',
					},
					{
						label: __( 'None', 'custom-html-block-extension' ),
						value: 'none',
						image: 'editor-options/render-line-highlight_4.jpg',
					},
				],
				help: {
					description: __(
						'Controls how the editor should render the current line highlight.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ) }
		/>
	);
}
