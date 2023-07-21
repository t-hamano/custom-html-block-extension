/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'lib/helper';

export default function FontSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			fontSize: value ? toNumber( value, 10, 30 ) : 14,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Font size (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.fontSize }
				min="10"
				max="30"
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
