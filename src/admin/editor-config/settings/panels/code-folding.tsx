/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel, SettingState } from '../types';

export default function getCodeFoldingPanel(): SettingPanel {
	const isFoldingDisabled = ( { editorOptions }: SettingState ) => ! editorOptions.folding;

	return {
		title: __( 'Code folding', 'custom-html-block-extension' ),
		settings: [
			{
				id: 'folding',
				control: 'toggle',
				label: __( 'Folding', 'custom-html-block-extension' ),
				...editorOption( 'folding' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor has code folding enabled.',
						'custom-html-block-extension'
					),
					image: 'editor-options/folding.gif',
				},
			},
			selectSetting( {
				id: 'showFoldingControls',
				control: 'select',
				label: __( 'Show Folding Controls', 'custom-html-block-extension' ),
				...editorOption( 'showFoldingControls' ),
				defaultValue: 'mouseover',
				isDisabled: isFoldingDisabled,
				options: [
					{
						label: __( 'Always show', 'custom-html-block-extension' ),
						image: 'editor-options/show-folding-controls_1.jpg',
						description: __( 'Always show the folding controls.', 'custom-html-block-extension' ),
						value: 'always',
					},
					{
						label: __( 'Show on mouseover', 'custom-html-block-extension' ),
						image: 'editor-options/show-folding-controls_2.gif',
						description: __(
							'Only show the folding controls when the mouse is over the gutter.',
							'custom-html-block-extension'
						),
						value: 'mouseover',
					},
					{
						label: __( 'Never show', 'custom-html-block-extension' ),
						image: 'editor-options/show-folding-controls_3.gif',
						description: __(
							'Never show the folding controls and reduce the gutter size.',
							'custom-html-block-extension'
						),
						value: 'never',
					},
				],
				help: {
					description: __(
						'Controls when the folding controls on the gutter are shown.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			selectSetting( {
				id: 'foldingStrategy',
				control: 'select',
				label: __( 'Folding Strategy', 'custom-html-block-extension' ),
				...editorOption( 'foldingStrategy' ),
				defaultValue: 'auto',
				isDisabled: isFoldingDisabled,
				options: [
					{
						label: __( 'Depends on the language', 'custom-html-block-extension' ),
						value: 'auto',
						image: 'editor-options/folding-strategy_1.gif',
						description: __(
							'Use a language-specific folding strategy if available, else the indentation-based one.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Depends on indentation', 'custom-html-block-extension' ),
						value: 'indentation',
						image: 'editor-options/folding-strategy_2.gif',
						description: __(
							'Use the indentation-based folding strategy.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Controls the strategy for computing folding ranges.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			{
				id: 'lineDecorationsWidth',
				control: 'range',
				label: __( 'Line Decorations Width (px)', 'custom-html-block-extension' ),
				...editorOption( 'lineDecorationsWidth' ),
				min: 0,
				max: 30,
				defaultValue: 0,
				isDisabled: isFoldingDisabled,
				help: {
					description: __(
						'The width reserved for line decorations. Line decorations are placed between line numbers and the editor content.',
						'custom-html-block-extension'
					),
					image: 'editor-options/line-decorations-width.gif',
				},
			},
			{
				id: 'foldingHighlight',
				control: 'toggle',
				label: __( 'Folding Highlight', 'custom-html-block-extension' ),
				...editorOption( 'foldingHighlight' ),
				defaultValue: true,
				isDisabled: isFoldingDisabled,
				help: {
					description: __(
						'Controls whether the editor should highlight folded ranges.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/folding-highlight_1.jpg',
							description: __(
								'Folded lines are shown with a background highlight.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/folding-highlight_2.jpg',
							description: __(
								'Folded lines are shown without a background highlight.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
			{
				id: 'unfoldOnClickAfterEndOfLine',
				control: 'toggle',
				label: __( 'Unfold On Click After End Of Line', 'custom-html-block-extension' ),
				...editorOption( 'unfoldOnClickAfterEndOfLine' ),
				defaultValue: false,
				isDisabled: isFoldingDisabled,
				help: {
					description: __(
						'Controls whether clicking on the empty content after a folded line will unfold the line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/unfold-on-click-after-end-of-line.gif',
				},
			},
		],
	};
}
