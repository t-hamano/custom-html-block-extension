/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel } from '../types';

export default function getCursorPanel(): SettingPanel {
	return {
		title: __( 'Cursor', 'custom-html-block-extension' ),
		settings: [
			selectSetting( {
				id: 'cursorStyle',
				control: 'select',
				label: __( 'Cursor Style', 'custom-html-block-extension' ),
				...editorOption( 'cursorStyle' ),
				defaultValue: 'line',
				options: [
					{
						label: __( 'Line', 'custom-html-block-extension' ),
						value: 'line',
						image: 'editor-options/cursor-style_1.jpg',
					},
					{
						label: __( 'Thin line', 'custom-html-block-extension' ),
						value: 'line-thin',
						image: 'editor-options/cursor-style_2.jpg',
					},
					{
						label: __( 'Block', 'custom-html-block-extension' ),
						value: 'block',
						image: 'editor-options/cursor-style_3.jpg',
					},
					{
						label: __( 'Outline', 'custom-html-block-extension' ),
						value: 'block-outline',
						image: 'editor-options/cursor-style_4.jpg',
					},
					{
						label: __( 'Underline', 'custom-html-block-extension' ),
						value: 'underline',
						image: 'editor-options/cursor-style_5.jpg',
					},
					{
						label: __( 'Thin underline', 'custom-html-block-extension' ),
						value: 'underline-thin',
						image: 'editor-options/cursor-style_6.jpg',
					},
				],
				help: {
					description: __( 'Controls the cursor style.', 'custom-html-block-extension' ),
					showOptions: true,
					colCount: 3,
				},
			} ),
			{
				id: 'cursorWidth',
				control: 'range',
				label: __( 'Cursor Width (px)', 'custom-html-block-extension' ),
				...editorOption( 'cursorWidth' ),
				min: 2,
				max: 10,
				defaultValue: 2,
				isDisabled: ( { editorOptions } ) => 'line' !== editorOptions.cursorStyle,
			},
			selectSetting( {
				id: 'cursorBlinking',
				control: 'select',
				label: __( 'Cursor Blinking', 'custom-html-block-extension' ),
				...editorOption( 'cursorBlinking' ),
				defaultValue: 'blink',
				options: [
					{
						label: __( 'Blink', 'custom-html-block-extension' ),
						value: 'blink',
						image: 'editor-options/cursor-blinking_1.gif',
					},
					{
						label: __( 'Smooth', 'custom-html-block-extension' ),
						value: 'smooth',
						image: 'editor-options/cursor-blinking_2.gif',
					},
					{
						label: __( 'Phase', 'custom-html-block-extension' ),
						value: 'phase',
						image: 'editor-options/cursor-blinking_3.gif',
					},
					{
						label: __( 'Expand', 'custom-html-block-extension' ),
						value: 'expand',
						image: 'editor-options/cursor-blinking_4.gif',
					},
					{
						label: __( 'Solid', 'custom-html-block-extension' ),
						value: 'solid',
						image: 'editor-options/cursor-blinking_5.jpg',
					},
				],
				help: {
					description: __( 'Controls the cursor animation style.', 'custom-html-block-extension' ),
					showOptions: true,
					colCount: 5,
				},
			} ),
			{
				id: 'cursorSurroundingLines',
				control: 'range',
				label: __( 'Cursor Surrounding Lines', 'custom-html-block-extension' ),
				...editorOption( 'cursorSurroundingLines' ),
				min: 0,
				max: 20,
				defaultValue: 0,
				help: {
					description: __(
						'Controls the minimal number of visible leading lines (minimum 0) and trailing lines (minimum 1) surrounding the cursor.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'0'
							),
							image: 'editor-options/cursor-surrounding-lines_1.gif',
							value: 0,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'5'
							),
							image: 'editor-options/cursor-surrounding-lines_2.gif',
							value: 5,
						},
					],
				},
			},
			{
				id: 'cursorSurroundingLinesStyle',
				control: 'toggle',
				label: __( 'Cursor Surrounding Lines Style', 'custom-html-block-extension' ),
				getValue: ( { editorOptions } ) => 'all' === editorOptions.cursorSurroundingLinesStyle,
				setValue: ( value ) => ( {
					editorOptions: { cursorSurroundingLinesStyle: !! value ? 'all' : 'default' },
				} ),
				defaultValue: false,
				help: {
					description: __(
						'Controls when "Cursor Surrounding Lines" should be enforced.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/cursor-surrounding-lines-style_1.gif',
							description: __(
								'"Cursor Surrounding Lines" is always enforced, including when the cursor is moved by a mouse click.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/cursor-surrounding-lines-style_2.gif',
							description: __(
								'"Cursor Surrounding Lines" is enforced only when the cursor is moved with the keyboard.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
			selectSetting( {
				id: 'cursorSmoothCaretAnimation',
				control: 'select',
				label: __( 'Cursor Smooth Caret Animation', 'custom-html-block-extension' ),
				...editorOption( 'cursorSmoothCaretAnimation' ),
				defaultValue: 'off',
				options: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: 'on',
						image: 'editor-options/cursor-smooth-caret-animation_1.gif',
						description: __(
							'Smooth caret animation is always enabled.',
							'custom-html-block-extension'
						),
					},
					{
						label: __(
							'Enable only when the cursor is moved explicitly',
							'custom-html-block-extension'
						),
						value: 'explicit',
						image: 'editor-options/cursor-smooth-caret-animation_2.gif',
						description: __(
							'Smooth caret animation is enabled only when the user moves the cursor with an explicit gesture.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: 'off',
						image: 'editor-options/cursor-smooth-caret-animation_3.gif',
						description: __( 'Smooth caret animation is disabled.', 'custom-html-block-extension' ),
					},
				],
				help: {
					description: __(
						'Controls whether the smooth caret animation should be enabled.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
		],
	};
}
