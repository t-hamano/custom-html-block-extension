/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption, selectSetting } from '../../components/setting-item/helpers';

export default function FindSeedSearchStringFromSelection() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Seed Search String From Selection', 'custom-html-block-extension' ),
				group: __( 'Find', 'custom-html-block-extension' ),
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
			} ) }
		/>
	);
}
