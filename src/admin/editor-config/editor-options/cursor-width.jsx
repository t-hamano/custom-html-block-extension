/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'admin/common/helper';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

import { PanelRow, RangeControl } from '@wordpress/components';

const CursorWidth = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorWidth: value ? toNumber( value, 2, 10 ) : 2,
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Cursor width', 'custom-html-block-extension' ) }
				value={ editorOptions.cursorWidth }
				min="2"
				max="10"
				allowReset
				onChange={ handleChange }
			/>
		</PanelRow>
	);
};

export default CursorWidth;
