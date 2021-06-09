/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';

/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

import {
	PanelBody,
	PanelRow,
	ToggleControl
} from '@wordpress/components';

const Permission = () => {
	const { options, setOptions } = useContext( AdminContext );

	const handleBlockEditorChange = ( value ) => {
		setOptions({
			...options,
			permissionBlockEditor: value
		});
	};

	const handleClassicEditorChange = ( value ) => {
		setOptions({
			...options,
			permissionClassicEditor: value
		});
	};

	return (
		<PanelBody title={ __( 'Permission', 'custom-html-block-extension' ) } >
			<PanelRow>
				<ToggleControl
					label={ __( 'Enable on Gutenberg Block Editor', 'custom-html-block-extension' ) }
					checked={ options.permissionBlockEditor }
					onChange={ ( value ) => handleBlockEditorChange( value ) }
				/>
			</PanelRow>
			<PanelRow>
				<ToggleControl
					label={ __( 'Enable on Classic Editor', 'custom-html-block-extension' ) }
					checked={ options.permissionClassicEditor }
					onChange={ ( value ) => handleClassicEditorChange( value ) }
				/>
			</PanelRow>
		</PanelBody>
	);
};

export default Permission;
