/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { addNotification } from 'admin/common/helper';

/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useContext, useState } from '@wordpress/element';

import {
	PanelBody,
	PanelRow,
	Button,
	FormFileUpload
} from '@wordpress/components';

const ImportEditorConfig = () => {
	const {
		setEditorSettings,
		setEditorOptions,
		setIsWaiting
	} = useContext( AdminContext );

	const [ importFile, setImportFile ] = useState();

	// Upload file (check file extension).
	const handleUploadFile = ( event ) => {
		const file = event.target.files[0];
		if ( undefined === file ) {
			setImportFile( null );
			return false;
		}

		if ( 'application/json' !== file.type ) {
			addNotification( __( 'It is not a JSON file.', 'custom-html-block-extension' ), 'danger', 5000 );
			setImportFile( null );
			return false;
		}

		setImportFile( file );
	};

	// Import editor config.
	const handleImportOptions = () => {
		const fileReader = new FileReader();
		fileReader.readAsText( importFile, 'UTF-8' );

		fileReader.onload = e => {
			try {
				const data = JSON.parse( e.target.result );
				setIsWaiting( true );

				// Update editor config.
				apiFetch({
					path: '/custom-html-block-extension/v1/import_editor_config',
					method: 'POST',
					data: data
				}).then( ( response ) => {
					setTimeout( () => {
						addNotification( __( 'Imported the editor config.', 'custom-html-block-extension' ), 'success', 5000 );
						setEditorSettings( response.editorSettings );
						setEditorOptions( response.editorOptions );
						setImportFile( null );
						setIsWaiting( false );
					}, 600 );
				});
			} catch ( e ) {

				// Invalid JSON format.
				addNotification( __( 'The format of JSON file is not correct.', 'custom-html-block-extension' ), 'danger', 5000 );
				return false;
			}
		};
	};

	return (
		<PanelBody title={ __( 'Import Editor Config', 'custom-html-block-extension' ) } >
			<PanelRow>
				<div>
					<p>{ __( 'Select the Custom HTML Block Extension JSON file you would like to import and click the import button below.', 'custom-html-block-extension' ) }</p>
					<div className="chbe-file-upload">
						<FormFileUpload
							accept="application/json"
							onChange={ handleUploadFile }
							render={ ({ openFileDialog }) => (
								<Button isSecondary onClick={ openFileDialog }>
									{ __( 'Upload file', 'custom-html-block-extension' ) }
								</Button>
							)}
						/>
						{ importFile && (
							<p className="chbe-file-upload__name">{ importFile.name }</p>
						)}
					</div>
					<Button
						isPrimary
						disabled={ ! importFile }
						onClick={ handleImportOptions }
					>
						{ __( 'Import', 'custom-html-block-extension' ) }
					</Button>
				</div>
			</PanelRow>
		</PanelBody>
	);
};

export default ImportEditorConfig;
