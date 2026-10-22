/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel, SettingState } from '../types';

export default function getMinimapPanel(): SettingPanel {
	const group = __( 'Minimap', 'custom-html-block-extension' );
	const isMinimapDisabled = ( { editorOptions }: SettingState ) => ! editorOptions.minimap.enabled;

	return {
		title: __( 'Minimap', 'custom-html-block-extension' ),
		settings: [
			{
				id: 'minimap.enabled',
				control: 'toggle',
				label: __( 'Minimap', 'custom-html-block-extension' ),
				group,
				...editorOption( 'minimap', 'enabled' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the minimap is shown.',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/enabled.gif',
				},
			},
			selectSetting( {
				id: 'minimap.side',
				control: 'toggleGroup',
				label: __( 'Side', 'custom-html-block-extension' ),
				group,
				...editorOption( 'minimap', 'side' ),
				defaultValue: 'right',
				isDisabled: isMinimapDisabled,
				options: [
					{
						label: __( 'Left', 'custom-html-block-extension' ),
						image: 'editor-options/minimap/side_1.jpg',
						value: 'left',
					},
					{
						label: __( 'Right', 'custom-html-block-extension' ),
						image: 'editor-options/minimap/side_2.jpg',
						value: 'right',
					},
				],
				help: {
					description: __(
						'Controls the side where to render the minimap.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			{
				id: 'minimap.maxColumn',
				control: 'range',
				label: __( 'Max Column', 'custom-html-block-extension' ),
				group,
				...editorOption( 'minimap', 'maxColumn' ),
				min: 10,
				max: 60,
				defaultValue: 60,
				isDisabled: isMinimapDisabled,
				help: {
					description: __(
						'Limit the width of the minimap to render at most a certain number of columns.',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/max-column.gif',
				},
			},
			{
				id: 'minimap.scale',
				control: 'range',
				label: __( 'Scale', 'custom-html-block-extension' ),
				group,
				...editorOption( 'minimap', 'scale' ),
				min: 1,
				max: 3,
				defaultValue: 1,
				isDisabled: isMinimapDisabled,
				help: {
					description: __(
						'Scale of content drawn in the minimap.',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/scale.gif',
				},
			},
			selectSetting( {
				id: 'minimap.autohide',
				control: 'select',
				label: __( 'Autohide', 'custom-html-block-extension' ),
				group,
				...editorOption( 'minimap', 'autohide' ),
				defaultValue: 'none',
				isDisabled: isMinimapDisabled,
				options: [
					{
						label: __( "Don't hide", 'custom-html-block-extension' ),
						value: 'none',
						image: 'editor-options/minimap/autohide_1.jpg',
						description: __( 'The minimap is always shown.', 'custom-html-block-extension' ),
					},
					{
						label: __( 'Show on mouseover', 'custom-html-block-extension' ),
						value: 'mouseover',
						image: 'editor-options/minimap/autohide_2.gif',
						description: __(
							'The minimap is hidden when mouse is not over the minimap and shown when mouse is over the minimap.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Show while scrolling', 'custom-html-block-extension' ),
						value: 'scroll',
						image: 'editor-options/minimap/autohide_3.gif',
						description: __(
							'The minimap is only shown when the editor is scrolled.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether the minimap is hidden automatically.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			selectSetting( {
				id: 'minimap.showSlider',
				control: 'select',
				label: __( 'Show Slider', 'custom-html-block-extension' ),
				group,
				...editorOption( 'minimap', 'showSlider' ),
				defaultValue: 'mouseover',
				isDisabled: isMinimapDisabled,
				options: [
					{
						label: __( 'Always show', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/minimap/show-slider_1.jpg',
					},
					{
						label: __( 'Show on mouseover', 'custom-html-block-extension' ),
						value: 'mouseover',
						image: 'editor-options/minimap/show-slider_2.gif',
					},
				],
				help: {
					description: __(
						'Controls when the minimap slider is shown.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			selectSetting( {
				id: 'minimap.size',
				control: 'select',
				label: __( 'Size', 'custom-html-block-extension' ),
				group,
				...editorOption( 'minimap', 'size' ),
				defaultValue: 'proportional',
				isDisabled: isMinimapDisabled,
				options: [
					{
						label: __( "Same as editor's content", 'custom-html-block-extension' ),
						value: 'proportional',
						description: __(
							'The minimap has the same size as the editor contents (and might scroll).',
							'custom-html-block-extension'
						),
						image: 'editor-options/minimap/size_1.jpg',
					},
					{
						label: __( 'Automatically zoom in or out', 'custom-html-block-extension' ),
						value: 'fill',
						description: __(
							'The minimap will stretch or shrink as necessary to fill the height of the editor (no scrolling).',
							'custom-html-block-extension'
						),
						image: 'editor-options/minimap/size_2.jpg',
					},
					{
						label: __( 'Automatically shrink', 'custom-html-block-extension' ),
						value: 'fit',
						description: __(
							'The minimap will shrink as necessary to never be larger than the editor (no scrolling).',
							'custom-html-block-extension'
						),
						image: 'editor-options/minimap/size_3.jpg',
					},
				],
				help: {
					description: __( 'Controls the size of the minimap.', 'custom-html-block-extension' ),
					showOptions: true,
					colCount: 3,
				},
			} ),
			{
				id: 'minimap.renderCharacters',
				control: 'toggle',
				label: __( 'Render Characters', 'custom-html-block-extension' ),
				group,
				...editorOption( 'minimap', 'renderCharacters' ),
				defaultValue: true,
				isDisabled: isMinimapDisabled,
				help: {
					description: __(
						'Render the actual characters on a line as opposed to color blocks.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							description: __( 'Show characters.', 'custom-html-block-extension' ),
							image: 'editor-options/minimap/render-characters_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							description: __( 'Show blocks.', 'custom-html-block-extension' ),
							image: 'editor-options/minimap/render-characters_2.jpg',
						},
					],
				},
			},
		],
	};
}
