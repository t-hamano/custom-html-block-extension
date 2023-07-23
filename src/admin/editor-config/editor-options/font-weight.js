/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';

export default function FontWeight( { fontWeights } ) {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Font weight', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			fontWeight: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ Number( editorOptions.fontWeight ) }
				options={ fontWeights.map( ( fontWeight ) => ( {
					label: fontWeight,
					value: fontWeight,
				} ) ) }
				onChange={ onChange }
			/>
		</div>
	);
}
