/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import themes from '../../../lib/themes';
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function Theme() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const onChange = ( value: string ) => {
		setEditorSettings( {
			...editorSettings,
			theme: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Theme', 'custom-html-block-extension' ) }
			value={ editorSettings.theme }
			onChange={ onChange }
			options={ [
				{ label: __( 'Visual Studio Dark', 'custom-html-block-extension' ), value: 'vs-dark' },
				{ label: __( 'Light', 'custom-html-block-extension' ), value: 'light' },
				...themes,
			] }
		/>
	);
}
