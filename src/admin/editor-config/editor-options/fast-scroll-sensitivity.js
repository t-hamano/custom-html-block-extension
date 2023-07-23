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
import { EditorConfigContext } from '../index';
import { toNumber } from '../../../lib/helper';

export default function FastScrollSensitivity() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __(
		'Mouse wheel scroll speed (when pressing Alt key)',
		'custom-html-block-extension'
	);
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			fastScrollSensitivity: value ? toNumber( value, 1, 10 ) : 5,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ title }
				min="1"
				max="10"
				value={ editorOptions.fastScrollSensitivity }
				allowReset
				onChange={ onChange }
			/>
		</div>
	);
}
