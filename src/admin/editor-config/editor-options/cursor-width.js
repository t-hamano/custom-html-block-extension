/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { toNumber } from '../../../lib/helper';

export default function CursorWidth() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorWidth: value ? toNumber( value, 2, 10 ) : 2,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Cursor width', 'custom-html-block-extension' ) }
				value={ editorOptions.cursorWidth }
				min="2"
				max="10"
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
