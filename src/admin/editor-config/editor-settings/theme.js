/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import themes from '../../../lib/themes';

export default function Theme() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Theme', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorSettings( {
			...editorSettings,
			theme: value,
		} );
	};

	return (
		<HStack>
			<SelectControl
				__nextHasNoMarginBottom
				label={ title }
				value={ editorSettings.theme }
				options={ [
					{ label: __( 'Visual Studio Dark', 'custom-html-block-extension' ), value: 'vs-dark' },
					{ label: __( 'Light', 'custom-html-block-extension' ), value: 'light' },
					...themes,
				] }
				onChange={ onChange }
			/>
		</HStack>
	);
}
