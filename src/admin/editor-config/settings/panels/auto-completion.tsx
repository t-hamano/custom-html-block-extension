/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel } from '../types';

export default function getAutoCompletionPanel(): SettingPanel {
	return {
		title: __( 'Auto completion', 'custom-html-block-extension' ),
		settings: [
			// Monaco also accepts 'full', but it only differs from 'advanced' with the
			// language's indentationRules, which none of the languages here define.
			selectSetting( {
				id: 'autoIndent',
				control: 'select',
				label: __( 'Auto Indent', 'custom-html-block-extension' ),
				...editorOption( 'autoIndent' ),
				defaultValue: 'advanced',
				shouldRefreshEditor: true,
				options: [
					{
						label: __( 'None', 'custom-html-block-extension' ),
						value: 'none',
						image: 'editor-options/auto-indent_1.gif',
						description: __(
							'The editor will not insert indentation automatically.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Keep', 'custom-html-block-extension' ),
						value: 'keep',
						image: 'editor-options/auto-indent_2.gif',
						description: __(
							"The editor will keep the current line's indentation.",
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Brackets', 'custom-html-block-extension' ),
						value: 'brackets',
						image: 'editor-options/auto-indent_3.gif',
						description: __(
							"The editor will keep the current line's indentation and honor language defined brackets.",
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Advanced', 'custom-html-block-extension' ),
						value: 'advanced',
						image: 'editor-options/auto-indent_4.gif',
						description: __(
							"The editor will keep the current line's indentation, honor language defined brackets and apply language-specific rules when pressing Enter.",
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether the editor should automatically adjust the indentation when users type, paste, move or indent lines.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 4,
				},
			} ),
			selectSetting( {
				id: 'autoClosingBrackets',
				control: 'select',
				label: __( 'Auto Closing Brackets', 'custom-html-block-extension' ),
				...editorOption( 'autoClosingBrackets' ),
				defaultValue: 'languageDefined',
				options: [
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/auto-closing-brackets_1.gif',
						description: __( 'Always autoclose brackets.', 'custom-html-block-extension' ),
					},
					{
						label: __( 'Determined by the language', 'custom-html-block-extension' ),
						value: 'languageDefined',
						image: 'editor-options/auto-closing-brackets_2.gif',
						description: __(
							'Use language configurations to determine when to autoclose brackets.',
							'custom-html-block-extension'
						),
					},
					{
						label: __(
							'Only when there is whitespace right after the cursor',
							'custom-html-block-extension'
						),
						value: 'beforeWhitespace',
						image: 'editor-options/auto-closing-brackets_3.gif',
						description: __(
							'Autoclose brackets only when the cursor is to the left of whitespace.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/auto-closing-brackets_4.gif',
						description: __( 'Never autoclose brackets.', 'custom-html-block-extension' ),
					},
				],
				help: {
					description: __(
						'Controls whether the editor should automatically close brackets after the user adds an opening bracket.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 2,
				},
			} ),
			selectSetting( {
				id: 'autoClosingQuotes',
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
			} ),
			selectSetting( {
				id: 'autoClosingDelete',
				control: 'select',
				label: __( 'Auto Closing Delete', 'custom-html-block-extension' ),
				...editorOption( 'autoClosingDelete' ),
				defaultValue: 'auto',
				options: [
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/auto-closing-delete_1.gif',
						description: __(
							'Always remove adjacent closing quotes or brackets when deleting.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
						value: 'auto',
						image: 'editor-options/auto-closing-delete_2.gif',
						description: __(
							'Remove adjacent closing quotes or brackets only if they were automatically inserted.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/auto-closing-delete_3.gif',
						description: __(
							'Never remove adjacent closing quotes or brackets when deleting.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether the editor should remove adjacent closing quotes or brackets when deleting.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			selectSetting( {
				id: 'autoClosingOvertype',
				control: 'select',
				label: __( 'Auto Closing Overtype', 'custom-html-block-extension' ),
				...editorOption( 'autoClosingOvertype' ),
				defaultValue: 'auto',
				options: [
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/auto-closing-overtype_1.gif',
						description: __(
							'Always type over closing quotes or brackets.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
						value: 'auto',
						image: 'editor-options/auto-closing-overtype_2.gif',
						description: __(
							'Type over closing quotes or brackets only if they were automatically inserted.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/auto-closing-overtype_3.gif',
						description: __(
							'Never type over closing quotes or brackets.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether the editor should type over closing quotes or brackets.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			selectSetting( {
				id: 'autoSurround',
				control: 'select',
				label: __( 'Auto Surround', 'custom-html-block-extension' ),
				...editorOption( 'autoSurround' ),
				defaultValue: 'languageDefined',
				options: [
					{
						label: __( 'Quotes and brackets', 'custom-html-block-extension' ),
						value: 'languageDefined',
						image: 'editor-options/auto-surround_1.gif',
					},
					{
						label: __( 'Quotes only', 'custom-html-block-extension' ),
						value: 'quotes',
						image: 'editor-options/auto-surround_2.gif',
					},
					{
						label: __( 'Brackets only', 'custom-html-block-extension' ),
						value: 'brackets',
						image: 'editor-options/auto-surround_3.gif',
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/auto-surround_4.gif',
					},
				],
				help: {
					description: __(
						'Controls whether the editor should automatically surround selections when typing quotes or brackets.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			{
				id: 'formatOnPaste',
				control: 'toggle',
				label: __( 'Format On Paste', 'custom-html-block-extension' ),
				...editorOption( 'formatOnPaste' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether the editor should automatically format the pasted content.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/format-on-paste_1.gif',
							description: __(
								'Pasted content is automatically formatted to match the surrounding code.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/format-on-paste_2.gif',
							description: __(
								'Pasted content is inserted as is, without formatting.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
		],
	};
}
