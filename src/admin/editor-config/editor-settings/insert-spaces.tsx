/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function InsertSpaces() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const onChange = ( value: string | number | undefined ) => {
		setEditorSettings( {
			...editorSettings,
			insertSpaces: value === 'space',
		} );
	};

	return (
		<SettingItem
			control="toggleGroup"
			label={ __( 'Insert Spaces', 'custom-html-block-extension' ) }
			value={ editorSettings.insertSpaces ? 'space' : 'tab' }
			onChange={ onChange }
			defaultValue="space"
			options={ [
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
			] }
			help={ {
				description: __(
					'Controls whether to insert a tab character or spaces when pressing the Tab key.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
