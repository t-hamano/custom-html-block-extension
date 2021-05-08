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

const FontSize = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			fontSize: value ? toNumber( value, 10, 30 ) : 14
		});
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Font size (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.fontSize }
				min="10"
				max="30"
				allowReset
				onChange={ ( value ) => handleChange( value ) }
			/>
		</PanelRow>
	);
};

export default FontSize;
