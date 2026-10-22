/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Link, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { editorOption, selectSetting } from '../helpers';
import type { SettingPanel } from '../types';

export default function getFontPanel(): SettingPanel {
	return {
		title: __( 'Font', 'custom-html-block-extension' ),
		settings: [
			selectSetting( {
				id: 'fontFamily',
				control: 'select',
				label: __( 'Font Family', 'custom-html-block-extension' ),
				...editorOption( 'fontFamily' ),
				options: [
					...window.chbeObj.fontFamily.map( ( { label, name } ) => ( {
						label: label ?? name,
						value: name,
					} ) ),
					{
						label: __( 'Monospace', 'custom-html-block-extension' ),
						value: 'monospace',
					},
				],
				help: {
					description: (
						<>
							<Text render={ <p /> }>
								{ __(
									'You can use your own favorite fonts in addition to the default fonts. Please refer to the following document for instructions on how to add custom fonts.',
									'custom-html-block-extension'
								) }
							</Text>
							<Text render={ <p /> }>
								<Link
									href={ __(
										'https://github.com/t-hamano/custom-html-block-extension#add-custom-fonts',
										'custom-html-block-extension'
									) }
									openInNewTab
								>
									{ __( 'GitHub project page', 'custom-html-block-extension' ) }
								</Link>
							</Text>
						</>
					),
				},
			} ),
			selectSetting( {
				id: 'fontWeight',
				control: 'select',
				label: __( 'Font Weight', 'custom-html-block-extension' ),
				...editorOption( 'fontWeight' ),
				options: ( { fontWeights } ) =>
					fontWeights.map( ( fontWeight ) => ( {
						label: String( fontWeight ),
						value: String( fontWeight ),
					} ) ),
			} ),
			{
				id: 'fontLigatures',
				control: 'toggle',
				label: __( 'Font Ligatures', 'custom-html-block-extension' ),
				...editorOption( 'fontLigatures' ),
				// monaco also accepts a string, used as the CSS `font-feature-settings`
				// value (e.g. '"ss01", "ss02"' for stylistic sets). Only Fira Code supports
				// ligatures among the fonts here, so a free-form field is of little use and
				// the toggle only maps between `true` and `false`.
				defaultValue: false,
				help: {
					description: __(
						"Enables/Disables font ligatures ('calt' and 'liga' font features). Only Fira Code font supports ligatures.",
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/font-ligatures_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/font-ligatures_2.jpg',
						},
					],
				},
			},
			{
				id: 'fontSize',
				control: 'range',
				label: __( 'Font Size (px)', 'custom-html-block-extension' ),
				...editorOption( 'fontSize' ),
				min: 10,
				max: 30,
				defaultValue: 14,
			},
			{
				id: 'lineHeight',
				control: 'range',
				label: __( 'Line Height', 'custom-html-block-extension' ),
				...editorOption( 'lineHeight' ),
				min: 0,
				max: 60,
				step: 0.1,
				defaultValue: 21,
				controlHelp: __(
					'0 computes the line height from the font size. Values less than 8 are a multiplier of the font size. Values of 8 or more are pixels.',
					'custom-html-block-extension'
				),
			},
			{
				id: 'letterSpacing',
				control: 'range',
				label: __( 'Letter Spacing (px)', 'custom-html-block-extension' ),
				...editorOption( 'letterSpacing' ),
				min: -2,
				max: 2,
				step: 0.1,
				defaultValue: 0,
			},
		],
	};
}
