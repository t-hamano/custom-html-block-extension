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

export default function LineHeight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			lineHeight: value ? toNumber( value, 10, 60 ) : 24,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Line height (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.lineHeight }
				min="10"
				max="60"
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
