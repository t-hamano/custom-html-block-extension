/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function BracketPairColorizationEnabled() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Bracket Pair Colorization', 'custom-html-block-extension' ),
				group: __( 'Bracket Pair Colorization', 'custom-html-block-extension' ),
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
			} }
		/>
	);
}
