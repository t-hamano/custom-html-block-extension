/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'admin/common/helper';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

import { PanelRow, RangeControl } from '@wordpress/components';

const FastScrollSensitivity = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			fastScrollSensitivity: value ? toNumber( value, 1, 10 ) : 5
		});
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Mouse wheel scroll speed (when pressing Alt key)', 'custom-html-block-extension' ) }
				min="1"
				max="10"
				value={ editorOptions.fastScrollSensitivity }
				allowReset
				onChange={ ( value ) => handleChange( value ) }
			/>
		</PanelRow>
	);
};

export default FastScrollSensitivity;
