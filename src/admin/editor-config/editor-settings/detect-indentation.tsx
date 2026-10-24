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

export default function DetectIndentation() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorSettings( {
			...editorSettings,
			detectIndentation: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="detectIndentation"
			label={ __( 'Detect Indentation', 'custom-html-block-extension' ) }
			value={ editorSettings.detectIndentation }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __(
					'Controls whether "Tab Size" and "Insert Spaces" will be automatically detected when a file is opened based on the file contents.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
