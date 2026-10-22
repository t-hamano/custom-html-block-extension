/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel, SettingState } from '../types';

export default function getMouseAndScrollPanel(): SettingPanel {
	const hoverGroup = __( 'Hover', 'custom-html-block-extension' );
	const stickyScrollGroup = __( 'Sticky Scroll', 'custom-html-block-extension' );
	const isHoverDisabled = ( { editorOptions }: SettingState ) =>
		'off' === editorOptions.hover.enabled;

	return {
		title: __( 'Mouse and scroll', 'custom-html-block-extension' ),
		settings: [
			{
				id: 'mouseWheelScrollSensitivity',
				control: 'range',
				label: __( 'Mouse Wheel Scroll Sensitivity', 'custom-html-block-extension' ),
				...editorOption( 'mouseWheelScrollSensitivity' ),
				min: 1,
				max: 10,
				defaultValue: 1,
			},
			{
				id: 'fastScrollSensitivity',
				control: 'range',
				label: __( 'Fast Scroll Sensitivity', 'custom-html-block-extension' ),
				...editorOption( 'fastScrollSensitivity' ),
				min: 1,
				max: 10,
				defaultValue: 5,
			},
			selectSetting( {
				id: 'hover.enabled',
				control: 'select',
				label: __( 'Show Hover Information', 'custom-html-block-extension' ),
				...editorOption( 'hover', 'enabled' ),
				defaultValue: 'on',
				options: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: 'on',
					},
					{
						label: __( 'Enable only while holding a modifier key', 'custom-html-block-extension' ),
						value: 'onKeyboardModifier',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: 'off',
					},
				],
				help: {
					description: ( { editorOptions } ) => {
						// monaco shows hints on the modifier key that is not used for multi cursor.
						let modifierKey;
						if ( 'alt' === editorOptions.multiCursorModifier ) {
							modifierKey = isAppleOS()
								? __( 'Command', 'custom-html-block-extension' )
								: __( 'Ctrl', 'custom-html-block-extension' );
						} else {
							modifierKey = isAppleOS()
								? __( 'Option', 'custom-html-block-extension' )
								: __( 'Alt', 'custom-html-block-extension' );
						}
						return (
							<>
								<Text render={ <p /> }>
									{ __(
										'Shows hints when the mouse is over an element or attribute.',
										'custom-html-block-extension'
									) }
								</Text>
								<Text render={ <p /> }>
									{ createInterpolateElement(
										sprintf(
											/* translators: %s is replaced with the modifier key name, such as "Ctrl". */
											__(
												'If "Enable only while holding a modifier key" is selected, hints are shown only while holding the <code>%s</code> key.',
												'custom-html-block-extension'
											),
											modifierKey
										),
										{
											code: <code />,
										}
									) }
								</Text>
							</>
						);
					},
					image: 'editor-options/hover.gif',
				},
			} ),
			{
				id: 'hover.delay',
				control: 'range',
				label: __( 'Hover Delay (ms)', 'custom-html-block-extension' ),
				group: hoverGroup,
				...editorOption( 'hover', 'delay' ),
				min: 0,
				max: 3000,
				step: 50,
				defaultValue: 300,
				isDisabled: isHoverDisabled,
				help: {
					description: __(
						'Controls the delay in milliseconds after which the hover is shown.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'300'
							),
							image: 'editor-options/hover/delay_1.gif',
							value: 300,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'1500'
							),
							image: 'editor-options/hover/delay_2.gif',
							value: 1500,
						},
					],
				},
			},
			{
				id: 'hover.sticky',
				control: 'toggle',
				label: __( 'Keep Hover Visible on Mouse Over', 'custom-html-block-extension' ),
				group: hoverGroup,
				...editorOption( 'hover', 'sticky' ),
				defaultValue: true,
				isDisabled: isHoverDisabled,
				help: {
					description: __(
						'Controls whether the hover should remain visible when mouse is moved over it.',
						'custom-html-block-extension'
					),
					image: 'editor-options/hover/sticky.gif',
				},
			},
			{
				id: 'hover.above',
				control: 'toggle',
				label: __( 'Prefer Hover Above', 'custom-html-block-extension' ),
				group: hoverGroup,
				...editorOption( 'hover', 'above' ),
				defaultValue: true,
				isDisabled: isHoverDisabled,
				help: {
					description: __(
						"Prefer showing hovers above the line, if there's space.",
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/hover/above_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/hover/above_2.jpg',
						},
					],
				},
			},
			{
				id: 'smoothScrolling',
				control: 'toggle',
				label: __( 'Smooth Scrolling', 'custom-html-block-extension' ),
				...editorOption( 'smoothScrolling' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether the editor will scroll using an animation.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/smooth-scrolling_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/smooth-scrolling_2.gif',
						},
					],
				},
			},
			{
				id: 'stickyScroll.enabled',
				control: 'toggle',
				label: __( 'Sticky Scroll', 'custom-html-block-extension' ),
				group: stickyScrollGroup,
				...editorOption( 'stickyScroll', 'enabled' ),
				defaultValue: true,
				help: {
					description: __(
						'Shows the nested current scopes during the scroll at the top of the editor.',
						'custom-html-block-extension'
					),
					image: 'editor-options/sticky-scroll/enabled.gif',
				},
			},
			{
				id: 'stickyScroll.maxLineCount',
				control: 'range',
				label: __( 'Max Line Count', 'custom-html-block-extension' ),
				group: stickyScrollGroup,
				...editorOption( 'stickyScroll', 'maxLineCount' ),
				min: 1,
				max: 20,
				defaultValue: 5,
				isDisabled: ( { editorOptions } ) => ! editorOptions.stickyScroll.enabled,
				help: {
					description: __(
						'Defines the maximum number of sticky lines to show.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'2'
							),
							image: 'editor-options/sticky-scroll/max-line-count_1.gif',
							value: 2,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'5'
							),
							image: 'editor-options/sticky-scroll/max-line-count_2.gif',
							value: 5,
						},
					],
				},
			},
			{
				id: 'scrollBeyondLastLine',
				control: 'toggle',
				label: __( 'Scroll Beyond Last Line', 'custom-html-block-extension' ),
				...editorOption( 'scrollBeyondLastLine' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor will scroll beyond the last line.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/scroll-beyond-last-line_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/scroll-beyond-last-line_2.gif',
						},
					],
				},
			},
			{
				id: 'scrollBeyondLastColumn',
				control: 'range',
				label: __( 'Scroll Beyond Last Column', 'custom-html-block-extension' ),
				...editorOption( 'scrollBeyondLastColumn' ),
				min: 0,
				max: 20,
				defaultValue: 4,
				help: {
					description: __(
						'Controls the number of extra characters beyond which the editor will scroll horizontally.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'0'
							),
							image: 'editor-options/scroll-beyond-last-column_1.gif',
							value: 0,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'20'
							),
							image: 'editor-options/scroll-beyond-last-column_2.gif',
							value: 20,
						},
					],
				},
			},
			{
				id: 'mouseWheelZoom',
				control: 'toggle',
				label: __( 'Mouse Wheel Zoom', 'custom-html-block-extension' ),
				...editorOption( 'mouseWheelZoom' ),
				defaultValue: false,
				help: {
					description: isAppleOS()
						? __(
								'Zoom the font of the editor when using mouse wheel and holding Cmd.',
								'custom-html-block-extension'
							)
						: __(
								'Zoom the font of the editor when using mouse wheel and holding Ctrl.',
								'custom-html-block-extension'
							),
					image: 'editor-options/mouse-wheel-zoom.gif',
				},
			},
			{
				id: 'dragAndDrop',
				control: 'toggle',
				label: __( 'Drag And Drop', 'custom-html-block-extension' ),
				...editorOption( 'dragAndDrop' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should allow moving selections via drag and drop.',
						'custom-html-block-extension'
					),
					image: 'editor-options/drag-and-drop.gif',
				},
			},
			{
				id: 'hideCursorInOverviewRuler',
				control: 'toggle',
				label: __( 'Hide Cursor In Overview Ruler', 'custom-html-block-extension' ),
				...editorOption( 'hideCursorInOverviewRuler' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether the cursor should be hidden in the overview ruler.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/hide-cursor-in-overview-ruler_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/hide-cursor-in-overview-ruler_2.jpg',
						},
					],
				},
			},
			selectSetting( {
				id: 'multiCursorModifier',
				control: 'toggleGroup',
				label: __( 'Multi Cursor Modifier', 'custom-html-block-extension' ),
				...editorOption( 'multiCursorModifier' ),
				defaultValue: 'alt',
				options: [
					{
						label: isAppleOS()
							? __( 'Option', 'custom-html-block-extension' )
							: __( 'Alt', 'custom-html-block-extension' ),
						value: 'alt',
					},
					{
						label: isAppleOS()
							? __( 'Command', 'custom-html-block-extension' )
							: __( 'Ctrl', 'custom-html-block-extension' ),
						value: 'ctrlCmd',
					},
				],
				help: {
					description: __(
						'The modifier to be used to add multiple cursors with the mouse.',
						'custom-html-block-extension'
					),
					image: 'editor-options/multi-cursor-modifier.gif',
				},
			} ),
		],
	};
}
