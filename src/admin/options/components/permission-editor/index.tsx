/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';

export default function PermissionEditor() {
	const { options, setOptions } = useContext( AdminContext );

	const onBlockEditorChange = ( value: boolean ) => {
		setOptions( {
			...options,
			permissionBlockEditor: value,
		} );
	};

	const onClassicEditorChange = ( value: boolean ) => {
		setOptions( {
			...options,
			permissionClassicEditor: value,
		} );
	};

	const onThemePluginEditorChange = ( value: boolean ) => {
		setOptions( {
			...options,
			permissionThemePluginEditor: value,
		} );
	};

	return (
		<PanelBody
			title={ __( 'Editors allowed to use this extension', 'custom-html-block-extension' ) }
		>
			<Stack direction="column" gap="lg">
				<ToggleControl
					label={ __( 'Block editor', 'custom-html-block-extension' ) }
					checked={ options.permissionBlockEditor }
					onChange={ onBlockEditorChange }
				/>
				<ToggleControl
					label={ __( 'Classic editor', 'custom-html-block-extension' ) }
					checked={ options.permissionClassicEditor }
					onChange={ onClassicEditorChange }
				/>
				<ToggleControl
					label={ __( 'Theme and Plugin editor', 'custom-html-block-extension' ) }
					checked={ options.permissionThemePluginEditor }
					onChange={ onThemePluginEditorChange }
				/>
			</Stack>
		</PanelBody>
	);
}
