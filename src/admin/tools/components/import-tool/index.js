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

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { addNotification } from '../../../../lib/helper';

export default function ImportTool() {
	const { setEditorSettings, setEditorOptions, setIsWaiting } = useContext( AdminContext );

	const [ importFile, setImportFile ] = useState();

	// Upload file (check file extension).
	const onUploadFile = ( event ) => {
		const file = event.target.files[ 0 ];
		if ( undefined === file ) {
			setImportFile( null );
			return false;
		}

		if ( 'application/json' !== file.type ) {
			addNotification(
				__( 'It is not a JSON file.', 'custom-html-block-extension' ),
				'danger',
				5000
			);
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
						addNotification(
							__( 'Imported the editor config.', 'custom-html-block-extension' ),
							'success',
							5000
						);
						setEditorSettings( response.editorSettings );
						setEditorOptions( response.editorOptions );
						setImportFile( null );
						setIsWaiting( false );
					}, 600 );
				} );
			} catch ( error ) {
				// Invalid JSON format.
				addNotification(
					__( 'The format of JSON file is not correct.', 'custom-html-block-extension' ),
					'danger',
					5000
				);
				return false;
			}
		};
	};

	return (
		<PanelBody title={ __( 'Import editor config', 'custom-html-block-extension' ) }>
			<Text as="p">
				{ __(
					'Select the Custom HTML Block Extension JSON file you would like to import and click the import button below.',
					'custom-html-block-extension'
				) }
			</Text>
			<VStack spacing={ 4 } align="start">
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
