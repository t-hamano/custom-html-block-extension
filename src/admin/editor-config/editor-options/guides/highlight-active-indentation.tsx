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

export default function GuidesHighlightActiveIndentation() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Highlight Active Indentation', 'custom-html-block-extension' ),
				group: __( 'Guides', 'custom-html-block-extension' ),
				...editorOption( 'guides', 'highlightActiveIndentation' ),
				defaultValue: true,
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
			} ) }
		/>
	);
}
