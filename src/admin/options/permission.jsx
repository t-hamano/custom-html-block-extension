/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

const Permission = () => {
	const { options, setOptions } = useContext( AdminContext );

	const handleBlockEditorChange = ( value ) => {
		setOptions( {
			...options,
			permissionBlockEditor: value,
		} );
	};

	const handleClassicEditorChange = ( value ) => {
		setOptions( {
			...options,
			permissionClassicEditor: value,
		} );
	};

	const handleThemePluginEditorChange = ( value ) => {
		setOptions( {
			...options,
			permissionThemePluginEditor: value,
		} );
	};

	return (
		<PanelBody title={ __( 'Permission', 'custom-html-block-extension' ) }>
			<PanelRow>
				<ToggleControl
					label={ __( 'Enable on Block Editor', 'custom-html-block-extension' ) }
					checked={ options.permissionBlockEditor }
					onChange={ handleBlockEditorChange }
				/>
			</PanelRow>
			<PanelRow>
				<ToggleControl
					label={ __( 'Enable on Classic Editor', 'custom-html-block-extension' ) }
					checked={ options.permissionClassicEditor }
					onChange={ handleClassicEditorChange }
				/>
			</PanelRow>
			<PanelRow>
				<ToggleControl
					label={ __( 'Enable on Theme and Plugin Editor', 'custom-html-block-extension' ) }
					checked={ options.permissionThemePluginEditor }
					onChange={ handleThemePluginEditorChange }
				/>
			</PanelRow>
		</PanelBody>
	);
};

export default Permission;
