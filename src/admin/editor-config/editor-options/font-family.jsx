/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

import { PanelRow, SelectControl } from '@wordpress/components';

const FontFamily = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			fontFamily: value
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Font family', 'custom-html-block-extension' ) }
				value={ editorOptions.fontFamily }
				options={ chbeObj.fontFamily.map( ({ label, fontFamily }) => ({ label: label, value: fontFamily }) ) }
				onChange={ ( value ) => handleChange( value ) }
			/>
		</PanelRow>
	);
};

export default FontFamily;
