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

const LineHeight = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			lineHeight: value ? toNumber( value, 10, 60 ) : 24
		});
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Line height (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.lineHeight }
				min="10"
				max="60"
				allowReset
				onChange={ ( value ) => handleChange( value ) }
			/>
		</PanelRow>
	);
};

export default LineHeight;
