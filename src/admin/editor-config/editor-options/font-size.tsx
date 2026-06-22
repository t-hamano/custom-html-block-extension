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
import { useSearchVisibility } from '../index';
import { toNumber } from '../../../lib/helper';

export default function FontSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Font size (px)', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			fontSize: value ? toNumber( value, 10, 30 ) : 14,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<RangeControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ title }
				value={ editorOptions.fontSize }
				min={ 10 }
				max={ 30 }
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
