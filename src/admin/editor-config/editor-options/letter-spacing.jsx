/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'lib/helper';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

import { PanelRow, RangeControl } from '@wordpress/components';

const LetterSpacing = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			letterSpacing: value ? toNumber( value, -2, 2 ) : 0,
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Letter spacing (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.letterSpacing }
				min="-2"
				max="2"
				step="0.1"
				allowReset
				onChange={ handleChange }
			/>
		</PanelRow>
	);
};

export default LetterSpacing;
