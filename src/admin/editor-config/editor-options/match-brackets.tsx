/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function MatchBrackets() {
	return (
		<SettingItem
			setting={ selectSetting( {
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
			} ) }
		/>
	);
}
