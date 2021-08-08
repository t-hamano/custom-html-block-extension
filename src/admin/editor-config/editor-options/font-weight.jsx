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

const FontWeight = ({
	fontWeights
}) => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			fontWeight: value
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Font weight', 'custom-html-block-extension' ) }
				value={ Number( editorOptions.fontWeight ) }
				options={ fontWeights.map( ( fontWeight ) => ({ label: fontWeight, value: fontWeight }) ) }
				onChange={ handleChange }
			/>
		</PanelRow>
	);
};

export default FontWeight;
