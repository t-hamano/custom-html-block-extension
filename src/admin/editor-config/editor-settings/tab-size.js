/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { toNumber } from '../../../lib/helper';

export default function TabSize() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorSettings( {
			...editorSettings,
			tabSize: value ? toNumber( value, 1, 8 ) : 2,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Indent width', 'custom-html-block-extension' ) }
				value={ editorSettings.tabSize }
				min="1"
				max="8"
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
