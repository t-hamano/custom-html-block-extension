/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel, SettingState } from '../types';
import Rulers from '../custom/rulers';

export default function getHighlightAndRenderingPanel(): SettingPanel {
	const bracketPairColorizationGroup = __(
		'Bracket Pair Colorization',
		'custom-html-block-extension'
	);
	const guidesGroup = __( 'Guides', 'custom-html-block-extension' );
	const isBracketPairsDisabled = ( { editorOptions }: SettingState ) =>
		false === editorOptions.guides.bracketPairs;
	const unicodeHighlightGroup = __( 'Unicode Highlight', 'custom-html-block-extension' );

	return {
		title: __( 'Highlight and rendering', 'custom-html-block-extension' ),
		settings: [
			selectSetting( {
				id: 'matchBrackets',
				control: 'select',
				label: __( 'Match Brackets', 'custom-html-block-extension' ),
				...editorOption( 'matchBrackets' ),
				defaultValue: 'always',
				options: [
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/match-brackets_1.gif',
					},
					{
						label: __( 'Never', 'custom-html-block-extension' ),
						value: 'never',
						image: 'editor-options/match-brackets_2.gif',
					},
					{
						label: __( 'Only when the cursor is near the bracket', 'custom-html-block-extension' ),
						value: 'near',
						image: 'editor-options/match-brackets_3.gif',
					},
				],
				help: {
					description: __( 'Highlight matching brackets.', 'custom-html-block-extension' ),
					showOptions: true,
					colCount: 3,
				},
			} ),
			{
				id: 'bracketPairColorization.enabled',
				control: 'toggle',
				label: __( 'Bracket Pair Colorization', 'custom-html-block-extension' ),
				group: bracketPairColorizationGroup,
				...editorOption( 'bracketPairColorization', 'enabled' ),
				defaultValue: true,
				help: {
					description: (
						<Text render={ <p /> }>
							{ createInterpolateElement(
								__(
									'Color matching brackets, such as <code>()</code>, <code>[]</code>, and <code>{}</code>, according to their nesting level, so you can easily see which brackets form a pair.',
									'custom-html-block-extension'
								),
								{
									code: <code />,
								}
							) }
						</Text>
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/bracket-pair-colorization/enabled_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/bracket-pair-colorization/enabled_2.jpg',
						},
					],
				},
			},
			{
				id: 'bracketPairColorization.independentColorPoolPerBracketType',
				control: 'toggle',
				label: __( 'Independent Color Pool Per Bracket Type', 'custom-html-block-extension' ),
				group: bracketPairColorizationGroup,
				...editorOption( 'bracketPairColorization', 'independentColorPoolPerBracketType' ),
				defaultValue: false,
				isDisabled: ( { editorOptions } ) => ! editorOptions.bracketPairColorization.enabled,
				help: {
					description: __(
						'Controls whether each bracket type has its own independent color pool.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image:
								'editor-options/bracket-pair-colorization/independent-color-pool-per-bracket-type_1.jpg',
							description: createInterpolateElement(
								__(
									'Each bracket type, such as <code>()</code>, <code>[]</code>, and <code>{}</code>, is colored by its own nesting level.',
									'custom-html-block-extension'
								),
								{
									code: <code />,
								}
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image:
								'editor-options/bracket-pair-colorization/independent-color-pool-per-bracket-type_2.jpg',
							description: __(
								'All bracket types share one color sequence, colored by their combined nesting level.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
			{
				id: 'occurrencesHighlight',
				control: 'toggle',
				label: __( 'Occurrences Highlight', 'custom-html-block-extension' ),
				// monaco types this option as 'off' | 'singleFile' | 'multiFile'. 'multiFile'
				// highlights across every editor on the page, which is of little use for
				// separate Custom HTML blocks, so the toggle only maps between 'singleFile' and
				// 'off'.
				getValue: ( { editorOptions } ) => 'singleFile' === editorOptions.occurrencesHighlight,
				setValue: ( value ) => ( {
					editorOptions: { occurrencesHighlight: value ? 'singleFile' : 'off' },
				} ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should highlight semantic symbol occurrences.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/occurrences-highlight_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/occurrences-highlight_2.jpg',
						},
					],
				},
			},
			selectSetting( {
				id: 'renderWhitespace',
				control: 'select',
				label: __( 'Render Whitespace', 'custom-html-block-extension' ),
				...editorOption( 'renderWhitespace' ),
				defaultValue: 'selection',
				options: [
					{
						label: __( 'All', 'custom-html-block-extension' ),
						value: 'all',
						image: 'editor-options/render-whitespace_1.jpg',
					},
					{
						label: __(
							'Render whitespace other than single spaces between words',
							'custom-html-block-extension'
						),
						value: 'boundary',
						image: 'editor-options/render-whitespace_2.jpg',
					},
					{
						label: __(
							'Render only whitespace in the selected text',
							'custom-html-block-extension'
						),
						value: 'selection',
						image: 'editor-options/render-whitespace_3.jpg',
					},
					{
						label: __( 'Render only trailing whitespace', 'custom-html-block-extension' ),
						value: 'trailing',
						image: 'editor-options/render-whitespace_4.jpg',
					},
					{
						label: __( 'None', 'custom-html-block-extension' ),
						value: 'none',
						image: 'editor-options/render-whitespace_5.jpg',
					},
				],
				help: {
					description: __(
						'Controls how the editor should render whitespace characters.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			selectSetting( {
				id: 'renderLineHighlight',
				control: 'select',
				label: __( 'Render Line Highlight', 'custom-html-block-extension' ),
				...editorOption( 'renderLineHighlight' ),
				defaultValue: 'line',
				options: [
					{
						label: __( 'Line numbers and the editor content', 'custom-html-block-extension' ),
						value: 'all',
						image: 'editor-options/render-line-highlight_1.jpg',
					},
					{
						label: __( 'Only the editor content', 'custom-html-block-extension' ),
						value: 'line',
						image: 'editor-options/render-line-highlight_2.jpg',
					},
					{
						label: __( 'Only line numbers', 'custom-html-block-extension' ),
						value: 'gutter',
						image: 'editor-options/render-line-highlight_3.jpg',
					},
					{
						label: __( 'None', 'custom-html-block-extension' ),
						value: 'none',
						image: 'editor-options/render-line-highlight_4.jpg',
					},
				],
				help: {
					description: __(
						'Controls how the editor should render the current line highlight.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ),
			{
				id: 'renderLineHighlightOnlyWhenFocus',
				control: 'toggle',
				label: __( 'Render Line Highlight Only When Focus', 'custom-html-block-extension' ),
				...editorOption( 'renderLineHighlightOnlyWhenFocus' ),
				defaultValue: false,
				isDisabled: ( { editorOptions } ) => 'none' === editorOptions.renderLineHighlight,
				help: {
					description: __(
						'Controls if the editor should render the current line highlight only when the editor is focused.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/render-line-highlight-only-when-focus_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/render-line-highlight-only-when-focus_2.gif',
						},
					],
				},
			},
			{
				id: 'guides.indentation',
				control: 'toggle',
				label: __( 'Indentation', 'custom-html-block-extension' ),
				group: guidesGroup,
				...editorOption( 'guides', 'indentation' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should render indent guides.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/guides/indentation_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/guides/indentation_2.jpg',
						},
					],
				},
			},
			selectSetting( {
				id: 'guides.highlightActiveIndentation',
				control: 'select',
				label: __( 'Highlight Active Indentation', 'custom-html-block-extension' ),
				group: guidesGroup,
				...editorOption( 'guides', 'highlightActiveIndentation' ),
				defaultValue: true,
				isDisabled: ( { editorOptions } ) => ! editorOptions.guides.indentation,
				options: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/guides/highlight-active-indentation_1.gif',
						description: __(
							'Highlights the active indent guide. Not highlighted on lines where a bracket pair guide is shown.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Always', 'custom-html-block-extension' ),
						value: 'always',
						image: 'editor-options/guides/highlight-active-indentation_2.gif',
						description: __(
							'Highlights the active indent guide even if bracket guides are highlighted.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/guides/highlight-active-indentation_3.gif',
						description: __(
							'Do not highlight the active indent guide.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: (
						<Text render={ <p /> }>
							{ __(
								'Highlight the indent guide of the block at the cursor. This applies to the indent guides shown by Indentation, not to the bracket pair guides.',
								'custom-html-block-extension'
							) }
						</Text>
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			selectSetting( {
				id: 'guides.bracketPairs',
				control: 'select',
				label: __( 'Bracket Pairs', 'custom-html-block-extension' ),
				group: guidesGroup,
				...editorOption( 'guides', 'bracketPairs' ),
				defaultValue: false,
				options: [
					{
						label: __( 'All bracket pairs', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/guides/bracket-pairs_1.jpg',
					},
					{
						label: __( 'Only the active bracket pair', 'custom-html-block-extension' ),
						value: 'active',
						image: 'editor-options/guides/bracket-pairs_2.jpg',
					},
					{
						label: __( 'None', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/guides/bracket-pairs_3.jpg',
					},
				],
				help: {
					description: (
						<Text render={ <p /> }>
							{ __(
								'Draw vertical lines between matching brackets, so you can see which code is inside each pair.',
								'custom-html-block-extension'
							) }
						</Text>
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			selectSetting( {
				id: 'guides.bracketPairsHorizontal',
				control: 'select',
				label: __( 'Bracket Pairs Horizontal', 'custom-html-block-extension' ),
				group: guidesGroup,
				...editorOption( 'guides', 'bracketPairsHorizontal' ),
				defaultValue: 'active',
				isDisabled: isBracketPairsDisabled,
				options: [
					{
						label: __( 'All bracket pairs', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/guides/bracket-pairs-horizontal_1.jpg',
					},
					{
						label: __( 'Only the active bracket pair', 'custom-html-block-extension' ),
						value: 'active',
						image: 'editor-options/guides/bracket-pairs-horizontal_2.jpg',
					},
					{
						label: __( 'None', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/guides/bracket-pairs-horizontal_3.jpg',
					},
				],
				help: {
					description: (
						<Text render={ <p /> }>
							{ __(
								'Add horizontal lines to the guides shown by Bracket Pairs, pointing to the brackets that are not at the start of a line.',
								'custom-html-block-extension'
							) }
						</Text>
					),
					showOptions: true,
					colCount: 3,
				},
			} ),
			{
				id: 'guides.highlightActiveBracketPair',
				control: 'toggle',
				label: __( 'Highlight Active Bracket Pair', 'custom-html-block-extension' ),
				group: guidesGroup,
				...editorOption( 'guides', 'highlightActiveBracketPair' ),
				defaultValue: true,
				isDisabled: isBracketPairsDisabled,
				help: {
					description: (
						<Text render={ <p /> }>
							{ __(
								'Draw the guide of the bracket pair at the cursor in the highlight color. When disabled, the guide is still shown in the normal color.',
								'custom-html-block-extension'
							) }
						</Text>
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/guides/highlight-active-bracket-pair_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/guides/highlight-active-bracket-pair_2.jpg',
						},
					],
				},
			},
			{
				id: 'renderControlCharacters',
				control: 'toggle',
				label: __( 'Render Control Characters', 'custom-html-block-extension' ),
				...editorOption( 'renderControlCharacters' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should render control characters.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/render-control-characters_1.jpg',
							description: __(
								'Control characters are shown as labeled symbols such as SOH or ETX.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/render-control-characters_2.jpg',
							description: __(
								'Control characters are shown as a generic placeholder symbol.',
								'custom-html-block-extension'
							),
						},
					],
				},
			},
			{
				id: 'unicodeHighlight.invisibleCharacters',
				control: 'toggle',
				label: __( 'Invisible Characters', 'custom-html-block-extension' ),
				group: unicodeHighlightGroup,
				...editorOption( 'unicodeHighlight', 'invisibleCharacters' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether characters that just reserve space or have no width at all are highlighted.',
						'custom-html-block-extension'
					),
					image: 'editor-options/unicode-highlight/invisible-characters.jpg',
				},
			},
			{
				id: 'unicodeHighlight.ambiguousCharacters',
				control: 'toggle',
				label: __( 'Ambiguous Characters', 'custom-html-block-extension' ),
				group: unicodeHighlightGroup,
				...editorOption( 'unicodeHighlight', 'ambiguousCharacters' ),
				defaultValue: true,
				help: {
					description: (
						<Text render={ <p /> }>
							{ createInterpolateElement(
								__(
									"Characters that look like common ASCII characters, such as the curly quote <code>‘</code> that looks like the straight quote <code>'</code>, are surrounded by a border.",
									'custom-html-block-extension'
								),
								{
									code: <code />,
								}
							) }
						</Text>
					),
					image: 'editor-options/unicode-highlight/ambiguous-characters.jpg',
				},
			},
			{
				id: 'unicodeHighlight.nonBasicASCII',
				control: 'toggle',
				label: __( 'Non Basic ASCII', 'custom-html-block-extension' ),
				group: unicodeHighlightGroup,
				...editorOption( 'unicodeHighlight', 'nonBasicASCII' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether all non-basic ASCII characters are highlighted. Only characters between U+0020 and U+007E, tab, line-feed and carriage-return are considered basic ASCII.',
						'custom-html-block-extension'
					),
					image: 'editor-options/unicode-highlight/non-basic-ascii.jpg',
				},
			},
			{
				id: 'rulers',
				control: 'custom',
				label: __( 'Rulers', 'custom-html-block-extension' ),
				component: Rulers,
			},
		],
	};
}
