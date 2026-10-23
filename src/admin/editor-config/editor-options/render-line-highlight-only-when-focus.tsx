/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function RenderLineHighlightOnlyWhenFocus() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Render Line Highlight Only When Focus', 'custom-html-block-extension' ),
				...editorOption( 'renderLineHighlightOnlyWhenFocus' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls if the editor should render the current line highlight only when the editor is focused.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/render-line-highlight-only-when-focus_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/render-line-highlight-only-when-focus_2.gif',
						},
					],
				},
			} }
		/>
	);
}
