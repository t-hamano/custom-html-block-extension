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

export default function GuidesBracketPairsHorizontal() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Bracket Pairs Horizontal', 'custom-html-block-extension' ),
				group: __( 'Guides', 'custom-html-block-extension' ),
				...editorOption( 'guides', 'bracketPairsHorizontal' ),
				defaultValue: 'active',
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
			} ) }
		/>
	);
}
