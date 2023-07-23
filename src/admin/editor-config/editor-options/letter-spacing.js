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
import { EditorConfigContext } from '../index';
import { toNumber } from '../../../lib/helper';

export default function LetterSpacing() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Letter spacing (px)', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			letterSpacing: value ? toNumber( value, -2, 2 ) : 0,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ title }
				value={ editorOptions.letterSpacing }
				min="-2"
				max="2"
				step="0.1"
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
