/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';

export default function Permission() {
	const { options, setOptions } = useContext( AdminContext );

	const onBlockEditorChange = ( value ) => {
		setOptions( {
			...options,
			permissionBlockEditor: value,
		} );
	};

	const onClassicEditorChange = ( value ) => {
		setOptions( {
			...options,
			permissionClassicEditor: value,
		} );
	};

	const onThemePluginEditorChange = ( value ) => {
		setOptions( {
			...options,
			permissionThemePluginEditor: value,
		} );
	};

	return (
		<PanelBody
			className="chbe-admin-options-permission"
			title={ __( 'Permission', 'custom-html-block-extension' ) }
		>
			<ToggleControl
				label={ __( 'Enable on the block editor', 'custom-html-block-extension' ) }
				checked={ options.permissionBlockEditor }
				onChange={ onBlockEditorChange }
			/>
			<ToggleControl
				label={ __( 'Enable on the classic editor', 'custom-html-block-extension' ) }
				checked={ options.permissionClassicEditor }
				onChange={ onClassicEditorChange }
			/>
			<ToggleControl
				label={ __( 'Enable on Theme and Plugin editor', 'custom-html-block-extension' ) }
				checked={ options.permissionThemePluginEditor }
				onChange={ onThemePluginEditorChange }
			/>
		</PanelBody>
	);
}
