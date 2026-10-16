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

	const title = __( 'Line height', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			lineHeight: value === undefined ? 21 : toNumber( value, 0, 60 ),
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<RangeControl
				label={ title }
				value={ editorOptions.lineHeight }
				min={ 0 }
				max={ 60 }
				step={ 0.1 }
				allowReset
				onChange={ onChange }
				help={ __(
					'0 computes the line height from the font size. Values less than 8 are a multiplier of the font size. Values of 8 or more are pixels.',
					'custom-html-block-extension'
				) }
			/>
		</div>
	);
}
