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

export default function MouseWheelScrollSensitivity() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			mouseWheelScrollSensitivity: value ? toNumber( value, 1, 10 ) : 1,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Mouse wheel scroll speed', 'custom-html-block-extension' ) }
				min="1"
				max="10"
				value={ editorOptions.mouseWheelScrollSensitivity }
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
