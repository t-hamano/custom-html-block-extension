/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel } from '../types';

export default function getSelectionPanel(): SettingPanel {
	return {
		title: __( 'Select, cut, copy, and paste', 'custom-html-block-extension' ),
		settings: [
			{
				id: 'emptySelectionClipboard',
				control: 'toggle',
				label: __( 'Empty Selection Clipboard', 'custom-html-block-extension' ),
				...editorOption( 'emptySelectionClipboard' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether copying without a selection copies the current line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/empty-selection-clipboard.gif',
				},
			},
			{
				id: 'roundedSelection',
				control: 'toggle',
				label: __( 'Rounded Selection', 'custom-html-block-extension' ),
				...editorOption( 'roundedSelection' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether selections should have rounded corners.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/rounded-selection_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/rounded-selection_2.jpg',
						},
					],
				},
			},
			{
				id: 'selectionHighlight',
				control: 'toggle',
				label: __( 'Selection Highlight', 'custom-html-block-extension' ),
				...editorOption( 'selectionHighlight' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should highlight matches similar to the selection.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/selection-highlight_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/selection-highlight_2.jpg',
						},
					],
				},
			},
			selectSetting( {
				id: 'multiCursorPaste',
				control: 'toggleGroup',
				label: __( 'Multi Cursor Paste', 'custom-html-block-extension' ),
				...editorOption( 'multiCursorPaste' ),
				defaultValue: 'spread',
				options: [
					{
						label: __( 'Spread', 'custom-html-block-extension' ),
						image: 'editor-options/multi-cursor-paste_1.gif',
						value: 'spread',
						description: __(
							'Each cursor pastes a single line of the text.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Full', 'custom-html-block-extension' ),
						image: 'editor-options/multi-cursor-paste_2.gif',
						value: 'full',
						description: __( 'Each cursor pastes the full text.', 'custom-html-block-extension' ),
					},
				],
				help: {
					description: __(
						'Controls pasting when the line count of the pasted text matches the cursor count.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			{
				id: 'stickyTabStops',
				control: 'toggle',
				label: __( 'Sticky Tab Stops', 'custom-html-block-extension' ),
				...editorOption( 'stickyTabStops' ),
				defaultValue: false,
				help: {
					description: __(
						'Emulate selection behavior of tab characters when using spaces for indentation. Selection will stick to tab stops.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/sticky-tab-stops_1.gif',
							description: __(
								'Within indentation made of spaces, the Left and Right arrow keys move the cursor by a full tab stop, as if the indentation were tab characters.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/sticky-tab-stops_2.gif',
							description: __(
								'Within indentation made of spaces, the Left and Right arrow keys move the cursor one space at a time.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
			{
				id: 'copyWithSyntaxHighlighting',
				control: 'toggle',
				label: __( 'Copy With Syntax Highlighting', 'custom-html-block-extension' ),
				...editorOption( 'copyWithSyntaxHighlighting' ),
				defaultValue: true,
				help: {
					description: (
						<>
							<Text render={ <p /> }>
								{ __(
									'Controls whether syntax highlighting should be copied into the clipboard.',
									'custom-html-block-extension'
								) }
							</Text>
							<Text render={ <p /> }>
								{ __(
									'Example: How it looks when pasted into Microsoft Word.',
									'custom-html-block-extension'
								) }
							</Text>
						</>
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/copy-with-syntax-highlighting_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/copy-with-syntax-highlighting_2.jpg',
						},
					],
				},
			},
			{
				id: 'columnSelection',
				control: 'toggle',
				label: __( 'Column Selection', 'custom-html-block-extension' ),
				...editorOption( 'columnSelection' ),
				defaultValue: false,
				help: {
					description: (
						<>
							<Text render={ <p /> }>
								{ isAppleOS()
									? createInterpolateElement(
											__(
												'Always enable column selection. Even when disabled, you can make a column selection with <code>Shift</code> + <code>Option</code> + drag mouse, or <code>Shift</code> + <code>Option</code> + <code>Command</code> + arrow key.',
												'custom-html-block-extension'
											),
											{
												code: <code />,
											}
										)
									: createInterpolateElement(
											__(
												'Always enable column selection. Even when disabled, you can make a column selection with <code>Shift</code> + <code>Alt</code> + drag mouse, or <code>Ctrl</code> + <code>Shift</code> + <code>Alt</code> + arrow key.',
												'custom-html-block-extension'
											),
											{
												code: <code />,
											}
										) }
							</Text>
						</>
					),
					image: 'editor-options/column-selection.gif',
				},
			},
		],
	};
}
