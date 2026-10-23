/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function LineNumbers() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Line Numbers', 'custom-html-block-extension' ),
				...editorOption( 'lineNumbers' ),
				defaultValue: 'on',
				options: [
					{
						label: __( 'Hide', 'custom-html-block-extension' ),
						value: 'off',
						image: 'editor-options/line-numbers_1.jpg',
					},
					{
						label: __( 'Show', 'custom-html-block-extension' ),
						value: 'on',
						image: 'editor-options/line-numbers_2.jpg',
					},
					{
						label: __( 'Show number of lines to cursor position', 'custom-html-block-extension' ),
						value: 'relative',
						image: 'editor-options/line-numbers_3.gif',
					},
					{
						label: __( 'Show every 10 lines', 'custom-html-block-extension' ),
						value: 'interval',
						image: 'editor-options/line-numbers_4.gif',
					},
				],
				help: {
					description: __( 'Controls the display of line numbers.', 'custom-html-block-extension' ),
					showOptions: true,
					colCount: 4,
				},
			} ) }
		/>
	);
}
