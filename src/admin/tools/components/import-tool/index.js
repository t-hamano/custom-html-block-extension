/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useContext, useState } from '@wordpress/element';
import {
	Button,
	FormFileUpload,
	PanelBody,
	__experimentalText as Text,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';

export default function ImportTool() {
	const { setEditorSettings, setEditorOptions, setIsWaiting } = useContext( AdminContext );

	const [ importFile, setImportFile ] = useState();
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	// Upload file (check file extension).
	const onUploadFile = ( event ) => {
		const file = event.target.files[ 0 ];
		if ( undefined === file ) {
			setImportFile( null );
			return false;
		}

		if ( 'application/json' !== file.type ) {
			createErrorNotice( __( 'It is not a JSON file.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
			setImportFile( null );
			return false;
		}

		setImportFile( file );
	};

	// Import editor config.
	const onImportOptions = () => {
		const fileReader = new window.FileReader();
		fileReader.readAsText( importFile, 'UTF-8' );

		fileReader.onload = ( event ) => {
			try {
				const data = JSON.parse( event.target.result );
				setIsWaiting( true );

				// Update editor config.
				apiFetch( {
					path: '/custom-html-block-extension/v1/import_editor_config',
					method: 'POST',
					data,
				} ).then( ( response ) => {
					setTimeout( () => {
						createSuccessNotice(
							__( 'Imported the editor config.', 'custom-html-block-extension' ),
							{
								type: 'snackbar',
							}
						);
						setEditorSettings( response.editorSettings );
						setEditorOptions( response.editorOptions );
						setImportFile( null );
						setIsWaiting( false );
					}, 600 );
				} );
			} catch ( error ) {
				// Invalid JSON format.
				createErrorNotice(
					__( 'The format of JSON file is not correct.', 'custom-html-block-extension' ),
					{
						type: 'snackbar',
					}
				);
				return false;
			}
		};
	};

	return (
		<PanelBody title={ __( 'Import editor config', 'custom-html-block-extension' ) }>
			<VStack spacing={ 4 } align="start">
				<Text as="p">
					{ __(
						'Select the Custom HTML Block Extension JSON file you would like to import and click the import button below.',
						'custom-html-block-extension'
					) }
				</Text>
				<HStack spacing={ 4 } justify="start" wrap>
					<FormFileUpload
						accept="application/json"
						onChange={ onUploadFile }
						render={ ( { openFileDialog } ) => (
							<Button variant="secondary" onClick={ openFileDialog } __next40pxDefaultSize>
								{ __( 'Upload file', 'custom-html-block-extension' ) }
							</Button>
						) }
					/>
					{ importFile && <span>{ importFile.name }</span> }
				</HStack>
				<Button
					variant="primary"
					disabled={ ! importFile }
					onClick={ onImportOptions }
					__next40pxDefaultSize
					__experimentalIsFocusable
				>
					{ __( 'Import', 'custom-html-block-extension' ) }
				</Button>
			</VStack>
		</PanelBody>
	);
}
