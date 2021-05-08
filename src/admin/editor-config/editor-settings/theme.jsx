/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import themes from 'themes';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { PanelRow, SelectControl } from '@wordpress/components';

const Theme = () => {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorSettings({
			...editorSettings,
			theme: value
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Theme', 'custom-html-block-extension' ) }
				value={ editorSettings.theme }
				options={ [
					{ label: __( 'Visual Studio Dark', 'custom-html-block-extension' ), value: 'vs-dark' },
					{ label: __( 'Light', 'custom-html-block-extension' ), value: 'light' },
					...themes
				] }
				onChange={ ( value ) => handleChange( value ) }
			/>
		</PanelRow>
	);
};

export default Theme;
