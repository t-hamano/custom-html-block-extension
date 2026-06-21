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

export default function CursorWidth() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Cursor width', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorWidth: value ? toNumber( value, 2, 10 ) : 2,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<RangeControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ title }
				value={ editorOptions.cursorWidth }
				min={ 2 }
				max={ 10 }
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
