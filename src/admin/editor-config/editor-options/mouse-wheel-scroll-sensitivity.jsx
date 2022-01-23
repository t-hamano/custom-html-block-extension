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

const MouseWheelScrollSensitivity = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			mouseWheelScrollSensitivity: value ? toNumber( value, 1, 10 ) : 1,
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Mouse wheel scroll speed', 'custom-html-block-extension' ) }
				min="1"
				max="10"
				value={ editorOptions.mouseWheelScrollSensitivity }
				allowReset
				onChange={ handleChange }
			/>
		</PanelRow>
	);
};

export default MouseWheelScrollSensitivity;
