/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel, SettingState } from '../types';

export default function getLineNumberPanel(): SettingPanel {
	const isLineNumbersDisabled = ( { editorOptions }: SettingState ) =>
		'off' === editorOptions.lineNumbers;

	return {
		title: __( 'Line number', 'custom-html-block-extension' ),
		settings: [
			selectSetting( {
				id: 'lineNumbers',
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
			} ),
			{
				id: 'lineNumbersMinChars',
				control: 'range',
				label: __( 'Line Numbers Min Chars', 'custom-html-block-extension' ),
				...editorOption( 'lineNumbersMinChars' ),
				min: 1,
				max: 10,
				defaultValue: 5,
				isDisabled: isLineNumbersDisabled,
				help: {
					description: __(
						'Controls the width of line numbers, by reserving horizontal space for rendering at least an amount of digits.',
						'custom-html-block-extension'
					),
					image: 'editor-options/line-numbers-min-chars.gif',
				},
			},
			{
				id: 'selectOnLineNumbers',
				control: 'toggle',
				label: __( 'Select On Line Numbers', 'custom-html-block-extension' ),
				...editorOption( 'selectOnLineNumbers' ),
				defaultValue: true,
				isDisabled: isLineNumbersDisabled,
				help: {
					description: __(
						'Controls whether the corresponding line is selected when clicking on the line number.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/select-on-line-numbers_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/select-on-line-numbers_2.gif',
						},
					],
				},
			},
			selectSetting( {
				id: 'renderFinalNewline',
				control: 'select',
				label: __( 'Render Final Newline', 'custom-html-block-extension' ),
				...editorOption( 'renderFinalNewline' ),
				defaultValue: 'on',
				isDisabled: isLineNumbersDisabled,
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
			} ),
		],
	};
}
