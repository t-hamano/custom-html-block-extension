/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function WordWrap() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Word Wrap', 'custom-html-block-extension' ),
				...editorOption( 'wordWrap' ),
				defaultValue: 'off',
				options: [
					{
						label: __( 'Off', 'custom-html-block-extension' ),
						value: 'off',
						image: 'editor-options/word-wrap_1.gif',
						description: __( 'Lines will never wrap.', 'custom-html-block-extension' ),
					},
					{
						label: __( 'On', 'custom-html-block-extension' ),
						value: 'on',
						image: 'editor-options/word-wrap_2.gif',
						description: __(
							'Lines will wrap at the viewport width.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Depends on word wrap column', 'custom-html-block-extension' ),
						value: 'wordWrapColumn',
						image: 'editor-options/word-wrap_3.gif',
						description: __(
							'Lines will wrap at "Word Wrap Column".',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Flexible', 'custom-html-block-extension' ),
						value: 'bounded',
						image: 'editor-options/word-wrap_4.gif',
						description: __(
							'Lines will wrap at the minimum of viewport and "Word Wrap Column".',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __( 'Controls how lines should wrap.', 'custom-html-block-extension' ),
					showOptions: true,
				},
			} ) }
		/>
	);
}
