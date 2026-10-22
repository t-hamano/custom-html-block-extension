/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel } from '../types';

export default function getFindPanel(): SettingPanel {
	const group = __( 'Find', 'custom-html-block-extension' );

	return {
		title: __( 'Find', 'custom-html-block-extension' ),
		settings: [
			{
				id: 'find.addExtraSpaceOnTop',
				control: 'toggle',
				label: __( 'Add Extra Space On Top', 'custom-html-block-extension' ),
				group,
				...editorOption( 'find', 'addExtraSpaceOnTop' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the Find Widget should add extra lines on top of the editor.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/find/addextra-space-on-top_1.jpg',
							description: __(
								'While the find widget is open, extra space is added above the first line so the widget does not cover it.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/find/addextra-space-on-top_2.jpg',
							description: __(
								'No extra space is added, so the find widget may cover the first lines.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
			selectSetting( {
				id: 'find.seedSearchStringFromSelection',
				control: 'select',
				label: __( 'Seed Search String From Selection', 'custom-html-block-extension' ),
				group,
				...editorOption( 'find', 'seedSearchStringFromSelection' ),
				defaultValue: 'always',
				options: [
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/find/seed-search-string-from-selection_1.gif',
						description: __(
							'Always seed search string from the editor selection, including word at cursor position.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Only from selected text', 'custom-html-block-extension' ),
						value: 'selection',
						image: 'editor-options/find/seed-search-string-from-selection_2.gif',
						description: __(
							'Only seed search string from the editor selection.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/find/seed-search-string-from-selection_3.gif',
						description: __(
							'Never seed search string from the editor selection.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls whether the search string in the Find Widget is seeded from the editor selection.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			{
				id: 'find.loop',
				control: 'toggle',
				label: __( 'Loop', 'custom-html-block-extension' ),
				group,
				...editorOption( 'find', 'loop' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the search automatically restarts from the beginning (or the end) when no further matches can be found.',
						'custom-html-block-extension'
					),
					image: 'editor-options/find/loop.gif',
				},
			},
		],
	};
}
