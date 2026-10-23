/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function AutoClosingQuotes() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Auto Closing Quotes', 'custom-html-block-extension' ),
				...editorOption( 'autoClosingQuotes' ),
				defaultValue: 'languageDefined',
				options: [
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/auto-closing-quotes_1.gif',
						description: __( 'Always autoclose quotes.', 'custom-html-block-extension' ),
					},
					{
						label: __( 'Determined by the language', 'custom-html-block-extension' ),
						value: 'languageDefined',
						image: 'editor-options/auto-closing-quotes_2.gif',
						description: __(
							'Use language configurations to determine when to autoclose quotes.',
							'custom-html-block-extension'
						),
					},
					{
						label: __(
							'Only when there is whitespace right after the cursor',
							'custom-html-block-extension'
						),
						value: 'beforeWhitespace',
						image: 'editor-options/auto-closing-quotes_3.gif',
						description: __(
							'Autoclose quotes only when the cursor is to the left of whitespace.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/auto-closing-quotes_4.gif',
						description: __( 'Never autoclose quotes.', 'custom-html-block-extension' ),
					},
				],
				help: {
					description: __(
						'Controls whether the editor should automatically close quotes after the user adds an opening quote.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 2,
				},
			} ) }
		/>
	);
}
