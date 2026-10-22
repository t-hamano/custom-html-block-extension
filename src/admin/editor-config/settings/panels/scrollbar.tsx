/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel, SettingState } from '../types';

export default function getScrollbarPanel(): SettingPanel {
	const group = __( 'Scrollbar', 'custom-html-block-extension' );
	const isHorizontalHidden = ( { editorOptions }: SettingState ) =>
		'hidden' === editorOptions.scrollbar.horizontal;
	const isVerticalHidden = ( { editorOptions }: SettingState ) =>
		'hidden' === editorOptions.scrollbar.vertical;

	return {
		title: __( 'Scrollbar', 'custom-html-block-extension' ),
		settings: [
			{
				id: 'scrollbar.useShadows',
				control: 'toggle',
				label: __( 'Use Shadows', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'useShadows' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether horizontal and vertical shadows are cast when the content is scrolled.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/use-shadows_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/use-shadows_2.jpg',
							value: false,
						},
					],
				},
			},
			{
				id: 'overviewRulerBorder',
				control: 'toggle',
				label: __( 'Overview Ruler Border', 'custom-html-block-extension' ),
				...editorOption( 'overviewRulerBorder' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether a border should be drawn around the overview ruler.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/overview-ruler-border_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/overview-ruler-border_2.jpg',
							value: false,
						},
					],
				},
			},
			{
				id: 'scrollbar.alwaysConsumeMouseWheel',
				control: 'toggle',
				label: __( 'Always Consume Mouse Wheel', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'alwaysConsumeMouseWheel' ),
				defaultValue: true,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls whether the editor keeps mouse wheel scrolling to itself, instead of passing it on to the page.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							description: __(
								'The page does not scroll, even when the editor is scrolled to the top or bottom.',
								'custom-html-block-extension'
							),
							image: 'editor-options/scrollbar/always-consume-mouse-wheel_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							description: __(
								'The page scrolls when the editor is scrolled to the top or bottom.',
								'custom-html-block-extension'
							),
							image: 'editor-options/scrollbar/always-consume-mouse-wheel_2.gif',
						},
					],
				},
			},
			{
				id: 'scrollbar.scrollByPage',
				control: 'toggle',
				label: __( 'Scroll By Page', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'scrollByPage' ),
				defaultValue: false,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls whether clicks scroll by page or jump to click position.',
						'custom-html-block-extension'
					),
					image: 'editor-options/scrollbar/scroll-by-page.gif',
				},
			},
			selectSetting( {
				id: 'scrollbar.horizontal',
				control: 'select',
				label: __( 'Horizontal', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'horizontal' ),
				defaultValue: 'auto',
				shouldRefreshEditor: true,
				options: [
					{
						label: __( 'Auto', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/horizontal_1.gif',
						value: 'auto',
					},
					{
						label: __( 'Visible', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/horizontal_2.jpg',
						value: 'visible',
					},
					{
						label: __( 'Hidden', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/horizontal_3.jpg',
						value: 'hidden',
					},
				],
				help: {
					description: __(
						'Controls the visibility of the horizontal scrollbar.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			{
				id: 'scrollbar.horizontalHasArrows',
				control: 'toggle',
				label: __( 'Horizontal Has Arrows', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'horizontalHasArrows' ),
				defaultValue: false,
				isDisabled: isHorizontalHidden,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls whether arrows are rendered at the left and right of the horizontal scrollbar.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/horizontal-has-arrows_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/horizontal-has-arrows_2.jpg',
							value: false,
						},
					],
				},
			},
			{
				id: 'scrollbar.horizontalScrollbarSize',
				control: 'range',
				label: __( 'Horizontal Scrollbar Size (px)', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'horizontalScrollbarSize' ),
				min: 5,
				max: 30,
				defaultValue: 12,
				isDisabled: isHorizontalHidden,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'The height of the horizontal scrollbar.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/scrollbar/horizontal-scrollbar-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/scrollbar/horizontal-scrollbar-size_2.jpg',
							value: 30,
						},
					],
				},
			},
			selectSetting( {
				id: 'scrollbar.vertical',
				control: 'select',
				label: __( 'Vertical', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'vertical' ),
				defaultValue: 'auto',
				shouldRefreshEditor: true,
				options: [
					{
						label: __( 'Auto', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/vertical_1.gif',
						value: 'auto',
					},
					{
						label: __( 'Visible', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/vertical_2.jpg',
						value: 'visible',
					},
					{
						label: __( 'Hidden', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/vertical_3.jpg',
						value: 'hidden',
					},
				],
				help: {
					description: __(
						'Controls the visibility of the vertical scrollbar.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			{
				id: 'scrollbar.verticalHasArrows',
				control: 'toggle',
				label: __( 'Vertical Has Arrows', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'verticalHasArrows' ),
				defaultValue: false,
				isDisabled: isVerticalHidden,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls whether arrows are rendered at the top and bottom of the vertical scrollbar.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/vertical-has-arrows_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/scrollbar/vertical-has-arrows_2.jpg',
							value: false,
						},
					],
				},
			},
			{
				id: 'scrollbar.verticalScrollbarSize',
				control: 'range',
				label: __( 'Vertical Scrollbar Size (px)', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'verticalScrollbarSize' ),
				min: 5,
				max: 30,
				defaultValue: 14,
				isDisabled: isVerticalHidden,
				shouldRefreshEditor: true,
				help: {
					description: __( 'The width of the vertical scrollbar.', 'custom-html-block-extension' ),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/scrollbar/vertical-scrollbar-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/scrollbar/vertical-scrollbar-size_2.jpg',
							value: 30,
						},
					],
				},
			},
			{
				id: 'scrollbar.arrowSize',
				control: 'range',
				label: __( 'Arrow Size (px)', 'custom-html-block-extension' ),
				group,
				...editorOption( 'scrollbar', 'arrowSize' ),
				min: 5,
				max: 50,
				defaultValue: 11,
				// Disabled unless a visible scrollbar has arrows.
				isDisabled: ( { editorOptions } ) =>
					! (
						( 'hidden' !== editorOptions.scrollbar.horizontal &&
							editorOptions.scrollbar.horizontalHasArrows ) ||
						( 'hidden' !== editorOptions.scrollbar.vertical &&
							editorOptions.scrollbar.verticalHasArrows )
					),
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls the size of the scrollbar arrows.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'10'
							),
							image: 'editor-options/scrollbar/arrow-size_1.jpg',
							value: 10,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'30'
							),
							image: 'editor-options/scrollbar/arrow-size_2.jpg',
							value: 30,
						},
					],
				},
			},
		],
	};
}
