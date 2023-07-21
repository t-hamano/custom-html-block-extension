/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import themes from 'lib/themes';

export default function Theme() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorSettings( {
			...editorSettings,
			theme: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Theme', 'custom-html-block-extension' ) }
				value={ editorSettings.theme }
				options={ [
					{ label: __( 'Visual Studio Dark', 'custom-html-block-extension' ), value: 'vs-dark' },
					{ label: __( 'Light', 'custom-html-block-extension' ), value: 'light' },
					...themes,
				] }
				onChange={ onChange }
			/>
		</div>
	);
}
