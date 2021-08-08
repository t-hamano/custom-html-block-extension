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

const TabSize = () => {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const handleChange = ( value ) => {
		setEditorSettings({
			...editorSettings,
			tabSize: value ? toNumber( value, 1, 8 ) : 2
		});
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Indent width', 'custom-html-block-extension' ) }
				value={ editorSettings.tabSize }
				min="1"
				max="8"
				allowReset
				onChange={ handleChange }
			/>
		</PanelRow>
	);
};

export default TabSize;
