/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function BracketPairColorizationIndependentColorPoolPerBracketType() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Independent Color Pool Per Bracket Type', 'custom-html-block-extension' ),
				group: __( 'Bracket Pair Colorization', 'custom-html-block-extension' ),
				...editorOption( 'bracketPairColorization', 'independentColorPoolPerBracketType' ),
				defaultValue: false,
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
			} }
		/>
	);
}
