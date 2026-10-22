/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel, SettingState } from '../types';

export default function getWordWrapPanel(): SettingPanel {
	const isWordWrapOff = ( { editorOptions }: SettingState ) => 'off' === editorOptions.wordWrap;

	return {
		title: __( 'Word wrap', 'custom-html-block-extension' ),
		settings: [
			selectSetting( {
				id: 'wordWrap',
				control: 'select',
				label: __( 'Word Wrap', 'custom-html-block-extension' ),
				...editorOption( 'wordWrap' ),
				defaultValue: 'off',
				options: [
					{
						label: __( 'Off', 'custom-html-block-extension' ),
						value: 'off',
						image: 'editor-options/word-wrap_1.gif',
						description: __( 'Lines will never wrap.', 'custom-html-block-extension' ),
					},
					{
						label: __( 'On', 'custom-html-block-extension' ),
						value: 'on',
						image: 'editor-options/word-wrap_2.gif',
						description: __(
							'Lines will wrap at the viewport width.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Depends on word wrap column', 'custom-html-block-extension' ),
						value: 'wordWrapColumn',
						image: 'editor-options/word-wrap_3.gif',
						description: __(
							'Lines will wrap at "Word Wrap Column".',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Flexible', 'custom-html-block-extension' ),
						value: 'bounded',
						image: 'editor-options/word-wrap_4.gif',
						description: __(
							'Lines will wrap at the minimum of viewport and "Word Wrap Column".',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __( 'Controls how lines should wrap.', 'custom-html-block-extension' ),
					showOptions: true,
				},
			} ),
			{
				id: 'wordWrapColumn',
				control: 'range',
				label: __( 'Word Wrap Column', 'custom-html-block-extension' ),
				...editorOption( 'wordWrapColumn' ),
				min: 20,
				max: 200,
				defaultValue: 80,
				isDisabled: ( { editorOptions } ) =>
					'on' === editorOptions.wordWrap || 'off' === editorOptions.wordWrap,
				help: {
					description: __(
						'Controls the wrapping column of the editor.',
						'custom-html-block-extension'
					),
					image: 'editor-options/word-wrap-column.gif',
				},
			},
			selectSetting( {
				id: 'wrappingIndent',
				control: 'select',
				label: __( 'Wrapping Indent', 'custom-html-block-extension' ),
				...editorOption( 'wrappingIndent' ),
				defaultValue: 'same',
				isDisabled: isWordWrapOff,
				options: [
					{
						label: __( 'None', 'custom-html-block-extension' ),
						image: 'editor-options/wrapping-indent_1.jpg',
						description: __(
							'No indentation. Wrapped lines begin at column 1.',
							'custom-html-block-extension'
						),
						value: 'none',
					},
					{
						label: __( 'Same', 'custom-html-block-extension' ),
						image: 'editor-options/wrapping-indent_2.jpg',
						description: __(
							'Wrapped lines get the same indentation as the parent.',
							'custom-html-block-extension'
						),
						value: 'same',
					},
					{
						label: __( 'Indent', 'custom-html-block-extension' ),
						image: 'editor-options/wrapping-indent_3.jpg',
						description: __(
							'Wrapped lines get +1 indentation toward the parent.',
							'custom-html-block-extension'
						),
						value: 'indent',
					},
					{
						label: __( 'Deep indent', 'custom-html-block-extension' ),
						image: 'editor-options/wrapping-indent_4.jpg',
						description: __(
							'Wrapped lines get +2 indentation toward the parent.',
							'custom-html-block-extension'
						),
						value: 'deepIndent',
					},
				],
				help: {
					description: __(
						'Controls the indentation of wrapped lines.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			{
				id: 'wordWrapIndicator',
				control: 'toggle',
				label: __( 'Word Wrap Indicator', 'custom-html-block-extension' ),
				...editorOption( 'wordWrapIndicator' ),
				defaultValue: false,
				isDisabled: isWordWrapOff,
				help: {
					description: __(
						'Controls whether an indicator is rendered at the wrapping column of lines that wrap.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/word-wrap-indicator_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/word-wrap-indicator_2.jpg',
						},
					],
				},
			},
		],
	};
}
