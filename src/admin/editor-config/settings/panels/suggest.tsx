/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel, SettingState } from '../types';
import QuickSuggestionsTypes, { getTokenTypes } from '../custom/quick-suggestions-types';

export default function getSuggestPanel(): SettingPanel {
	const group = __( 'Suggest', 'custom-html-block-extension' );
	const isSuggestDisabled = ( { editorOptions }: SettingState ) =>
		! editorOptions.suggestOnTriggerCharacters;

	return {
		title: __( 'Suggest', 'custom-html-block-extension' ),
		settings: [
			{
				id: 'quickSuggestions',
				control: 'toggle',
				label: __( 'Enable Suggestions', 'custom-html-block-extension' ),
				getValue: ( { editorOptions } ) => editorOptions.suggestOnTriggerCharacters,
				setValue: ( value ) => {
					const quickSuggestionsValue = value ? 'on' : 'off';
					return {
						editorOptions: {
							quickSuggestions: {
								other: quickSuggestionsValue,
								comments: quickSuggestionsValue,
								strings: quickSuggestionsValue,
							},
							suggestOnTriggerCharacters: value,
						},
					};
				},
				defaultValue: true,
				help: {
					description: __(
						'Get suggestions as you type codes. Accepting suggestions will autocomplete code and help faster coding.',
						'custom-html-block-extension'
					),
					image: 'editor-options/quick-suggestions.gif',
				},
			},
			{
				id: 'quickSuggestionsTypes',
				control: 'custom',
				label: __( 'Quick Suggestions', 'custom-html-block-extension' ),
				// The label only appears in the help dialog, so also match the labels shown.
				searchText: getTokenTypes()
					.map( ( tokenType ) => tokenType.label )
					.join( ' ' ),
				isDisabled: isSuggestDisabled,
				component: QuickSuggestionsTypes,
			},
			selectSetting( {
				id: 'acceptSuggestionOnEnter',
				control: 'select',
				label: __( 'Accept Suggestion On Enter', 'custom-html-block-extension' ),
				...editorOption( 'acceptSuggestionOnEnter' ),
				defaultValue: 'on',
				isDisabled: isSuggestDisabled,
				options: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: 'on',
						image: 'editor-options/accept-suggestion-on-enter_1.gif',
						description: __(
							'Pressing Enter accepts the suggestion, even if it is the same as the word already typed.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Only when it makes a text change', 'custom-html-block-extension' ),
						value: 'smart',
						image: 'editor-options/accept-suggestion-on-enter_2.gif',
						description: __(
							'Only accept a suggestion with Enter when it makes a textual change.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: 'off',
						image: 'editor-options/accept-suggestion-on-enter_3.gif',
						description: __(
							'Pressing Enter always inserts a new line. Use Tab to accept the suggestion.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: (
						<Text render={ <p /> }>
							{ createInterpolateElement(
								__(
									'Accept suggestions on <code>Enter</code> key in addition to <code>Tab</code> key.',
									'custom-html-block-extension'
								),
								{
									code: <code />,
								}
							) }
						</Text>
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			{
				id: 'quickSuggestionsDelay',
				control: 'range',
				label: __( 'Quick Suggestions Delay (ms)', 'custom-html-block-extension' ),
				...editorOption( 'quickSuggestionsDelay' ),
				min: 0,
				max: 1000,
				defaultValue: 10,
				isDisabled: isSuggestDisabled,
				help: {
					description: __(
						'Controls the delay in milliseconds after which quick suggestions will show up.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/quick-suggestions-delay_1.gif',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'1000'
							),
							image: 'editor-options/quick-suggestions-delay_2.gif',
							value: 1000,
						},
					],
				},
			},
			{
				id: 'suggestFontSize',
				control: 'range',
				label: __( 'Suggest Font Size (px)', 'custom-html-block-extension' ),
				...editorOption( 'suggestFontSize' ),
				min: 10,
				max: 30,
				defaultValue: 14,
				isDisabled: isSuggestDisabled,
				help: {
					description: __( 'Font size for the suggest widget.', 'custom-html-block-extension' ),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/suggest-font-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/suggest-font-size_2.jpg',
							value: 30,
						},
					],
				},
			},
			{
				id: 'suggestLineHeight',
				control: 'range',
				label: __( 'Suggest Line Height (px)', 'custom-html-block-extension' ),
				...editorOption( 'suggestLineHeight' ),
				min: 10,
				max: 60,
				defaultValue: 21,
				isDisabled: isSuggestDisabled,
				help: {
					description: __( 'Line height for the suggest widget.', 'custom-html-block-extension' ),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/suggest-line-height_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/suggest-line-height_2.jpg',
							value: 30,
						},
					],
				},
			},
			{
				id: 'suggest.showIcons',
				control: 'toggle',
				label: __( 'Show Icons', 'custom-html-block-extension' ),
				group,
				...editorOption( 'suggest', 'showIcons' ),
				defaultValue: true,
				isDisabled: isSuggestDisabled,
				help: {
					description: __(
						'Controls whether to show or hide icons in suggestions.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/suggest/show-icons_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/suggest/show-icons_2.jpg',
							value: false,
						},
					],
				},
			},
			selectSetting( {
				id: 'suggest.insertMode',
				control: 'select',
				label: __( 'Insert Mode', 'custom-html-block-extension' ),
				group,
				...editorOption( 'suggest', 'insertMode' ),
				defaultValue: 'insert',
				isDisabled: isSuggestDisabled,
				options: [
					{
						label: __( 'Insert', 'custom-html-block-extension' ),
						value: 'insert',
						image: 'editor-options/suggest/insert-mode_1.gif',
						description: __(
							'Insert suggestion without overwriting text right of the cursor.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Replace', 'custom-html-block-extension' ),
						value: 'replace',
						image: 'editor-options/suggest/insert-mode_2.gif',
						description: __(
							'Insert suggestion and overwrite text right of the cursor.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether words are overwritten when accepting completions.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 2,
				},
			} ),
			{
				id: 'suggest.preview',
				control: 'toggle',
				label: __( 'Preview', 'custom-html-block-extension' ),
				group,
				...editorOption( 'suggest', 'preview' ),
				defaultValue: false,
				isDisabled: isSuggestDisabled,
				help: {
					description: __(
						'Controls whether to preview the suggestion outcome in the editor.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/suggest/preview_1.gif',
							description: __(
								'The selected suggestion is shown in the editor before it is accepted.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/suggest/preview_2.gif',
							description: __(
								'The selected suggestion is shown only in the suggestion list until it is accepted.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
		],
	};
}
