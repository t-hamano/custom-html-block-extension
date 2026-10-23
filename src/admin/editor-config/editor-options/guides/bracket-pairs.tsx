/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption, selectSetting } from '../../components/setting-item/helpers';

export default function GuidesBracketPairs() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Bracket Pairs', 'custom-html-block-extension' ),
				group: __( 'Guides', 'custom-html-block-extension' ),
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
			} ) }
		/>
	);
}
