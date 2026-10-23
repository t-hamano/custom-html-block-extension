/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function RenderFinalNewline() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Render Final Newline', 'custom-html-block-extension' ),
				...editorOption( 'renderFinalNewline' ),
				defaultValue: 'on',
				options: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: 'on',
						image: 'editor-options/render-final-newline_1.jpg',
						description: __(
							'The last line number is shown when the file ends with a newline.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Dimmed', 'custom-html-block-extension' ),
						value: 'dimmed',
						image: 'editor-options/render-final-newline_2.jpg',
						description: __(
							'The last line number is shown dimmed when the file ends with a newline.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: 'off',
						image: 'editor-options/render-final-newline_3.jpg',
						description: __(
							'The last line number is not shown when the file ends with a newline.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Render last line number when the file ends with a newline.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
