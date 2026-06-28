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

export default function LineHeight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Line height (px)', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			lineHeight: value ? toNumber( value, 10, 60 ) : 24,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<RangeControl
				__next40pxDefaultSize
				label={ title }
				value={ editorOptions.lineHeight }
				min={ 10 }
				max={ 60 }
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
