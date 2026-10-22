/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Link, Notice, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { editorOption, editorSetting, selectSetting } from '../helpers';
import type { SettingPanel } from '../types';
import themes from '../../../../lib/themes';

export default function getEditorPanel(): SettingPanel {
	const paddingGroup = __( 'Padding', 'custom-html-block-extension' );

	return {
		title: __( 'Editor', 'custom-html-block-extension' ),
		settings: [
			selectSetting( {
				id: 'theme',
				control: 'select',
				label: __( 'Theme', 'custom-html-block-extension' ),
				...editorSetting( 'theme' ),
				options: [
					{ label: __( 'Visual Studio Dark', 'custom-html-block-extension' ), value: 'vs-dark' },
					{ label: __( 'Light', 'custom-html-block-extension' ), value: 'light' },
					...themes,
				],
			} ),
			{
				id: 'tabSize',
				control: 'range',
				label: __( 'Tab Size', 'custom-html-block-extension' ),
				...editorSetting( 'tabSize' ),
				min: 1,
				max: 8,
				defaultValue: 4,
			},
			selectSetting( {
				id: 'insertSpaces',
				control: 'toggleGroup',
				label: __( 'Insert Spaces', 'custom-html-block-extension' ),
				getValue: ( { editorSettings } ) => ( editorSettings.insertSpaces ? 'space' : 'tab' ),
				setValue: ( value ) => ( { editorSettings: { insertSpaces: value === 'space' } } ),
				defaultValue: 'space',
				options: [
					{
						label: __( 'Tab', 'custom-html-block-extension' ),
						image: 'editor-settings/insert-spaces_1.jpg',
						value: 'tab',
					},
					{
						label: __( 'Space', 'custom-html-block-extension' ),
						image: 'editor-settings/insert-spaces_2.jpg',
						value: 'space',
					},
				],
				help: {
					description: __(
						'Controls whether to insert a tab character or spaces when pressing the Tab key.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			{
				id: 'detectIndentation',
				control: 'toggle',
				label: __( 'Detect Indentation', 'custom-html-block-extension' ),
				...editorSetting( 'detectIndentation' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether "Tab Size" and "Insert Spaces" will be automatically detected when a file is opened based on the file contents.',
						'custom-html-block-extension'
					),
				},
			},
			{
				id: 'emmet',
				control: 'toggle',
				label: __( 'Enable Emmet', 'custom-html-block-extension' ),
				...editorSetting( 'emmet' ),
				defaultValue: true,
				help: {
					description: (
						<>
							<Text render={ <p /> }>
								{ __(
									'Emmet is a function for the editor that allows for high-speed coding via content assist. In the block and classic editor, it is only valid for HTML tags and does not support inline CSS. In the theme/plugin editor, it is available if the file extension is html, php, sass, scss, css, or less.',
									'custom-html-block-extension'
								) }
							</Text>
							<Text render={ <p /> }>
								{ createInterpolateElement(
									__(
										'Select text and run "Emmet: Wrap with Abbreviation" from the context menu or the command palette (<code>F1</code>) to wrap it with an abbreviation. In the theme/plugin editor, this is available if the file extension is html or php.',
										'custom-html-block-extension'
									),
									{
										code: <code />,
									}
								) }
							</Text>
							<Text render={ <p /> }>
								<Link href="https://docs.emmet.io/cheat-sheet/" openInNewTab>
									{ __( 'Check cheat sheet', 'custom-html-block-extension' ) }
								</Link>
							</Text>
							<Notice.Root intent="warning">
								<Notice.Description>
									{ __(
										'Save and reload the browser to reflect this settings in the preview editor area.',
										'custom-html-block-extension'
									) }
								</Notice.Description>
							</Notice.Root>
						</>
					),
					image: 'editor-settings/emmet.gif',
				},
			},
			{
				id: 'contextmenu',
				control: 'toggle',
				label: __( 'Context Menu', 'custom-html-block-extension' ),
				...editorOption( 'contextmenu' ),
				defaultValue: true,
				help: {
					description: __( 'Enable custom context menu.', 'custom-html-block-extension' ),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/contextmenu_1.jpg',
							description: __( 'Show the editor context menu.', 'custom-html-block-extension' ),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/contextmenu_2.jpg',
							description: __( 'Show the browser context menu.', 'custom-html-block-extension' ),
						},
					],
				},
			},
			{
				id: 'glyphMargin',
				control: 'toggle',
				label: __( 'Glyph Margin', 'custom-html-block-extension' ),
				...editorOption( 'glyphMargin' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should render the vertical glyph margin.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/glyph-margin_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/glyph-margin_2.jpg',
						},
					],
				},
			},
			{
				id: 'padding.top',
				control: 'range',
				label: __( 'Top (px)', 'custom-html-block-extension' ),
				group: paddingGroup,
				...editorOption( 'padding', 'top' ),
				min: 0,
				max: 50,
				defaultValue: 0,
				help: {
					description: __(
						'Controls the amount of space between the top edge of the editor and the first line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/padding/top.gif',
				},
			},
			{
				id: 'padding.bottom',
				control: 'range',
				label: __( 'Bottom (px)', 'custom-html-block-extension' ),
				group: paddingGroup,
				...editorOption( 'padding', 'bottom' ),
				min: 0,
				max: 50,
				defaultValue: 0,
				help: {
					description: __(
						'Controls the amount of space between the bottom edge of the editor and the last line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/padding/bottom.gif',
				},
			},
		],
	};
}
