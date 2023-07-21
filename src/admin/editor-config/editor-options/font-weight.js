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

export default function FontWeight( { fontWeights } ) {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			fontWeight: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Font weight', 'custom-html-block-extension' ) }
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
