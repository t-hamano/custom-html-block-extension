/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { selectSetting } from '../components/setting-item/helpers';

export default function InsertSpaces() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'toggleGroup',
				label: __( 'Insert Spaces', 'custom-html-block-extension' ),
				getValue: ( { editorSettings } ) => ( editorSettings.insertSpaces ? 'space' : 'tab' ),
				setValue: ( value ) => ( { editorSettings: { insertSpaces: value === 'space' } } ),
				defaultValue: 'space',
				options: [
					{
						label: __( 'Tab', 'custom-html-block-extension' ),
						image: 'editor-settings/insert-spaces_1.jpg',
						value: 'tab',
					},
					{
						label: __( 'Space', 'custom-html-block-extension' ),
						image: 'editor-settings/insert-spaces_2.jpg',
						value: 'space',
					},
				],
				help: {
					description: __(
						'Controls whether to insert a tab character or spaces when pressing the Tab key.',
						'custom-html-block-extension'
					),
					showOptions: true,
				},
			} ) }
		/>
	);
}
