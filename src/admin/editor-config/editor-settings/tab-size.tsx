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

export default function TabSize() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const title = __( 'Indent width', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorSettings( {
			...editorSettings,
			tabSize: value ? toNumber( value, 1, 8 ) : 2,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<RangeControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ title }
				value={ editorSettings.tabSize }
				min={ 1 }
				max={ 8 }
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
