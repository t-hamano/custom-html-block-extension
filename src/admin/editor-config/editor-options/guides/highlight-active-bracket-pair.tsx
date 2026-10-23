/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function GuidesHighlightActiveBracketPair() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Highlight Active Bracket Pair', 'custom-html-block-extension' ),
				group: __( 'Guides', 'custom-html-block-extension' ),
				...editorOption( 'guides', 'highlightActiveBracketPair' ),
				defaultValue: true,
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
			} }
		/>
	);
}
