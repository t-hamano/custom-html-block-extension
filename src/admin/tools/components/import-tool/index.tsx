/**
 * External dependencies
 */
import type { ChangeEvent } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useContext, useState } from '@wordpress/element';
import { Button, FormFileUpload, PanelBody } from '@wordpress/components';
import { Stack, Text } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import type { EditorSettings, EditorOptions } from '../../../../types';

export default function ImportTool() {
	const { setEditorSettings, setEditorOptions, setIsWaiting } = useContext( AdminContext );

	const [ importFile, setImportFile ] = useState< File | null >( null );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	// Upload file (check file extension).
	const onUploadFile = ( event: ChangeEvent< HTMLInputElement > ) => {
		const file = event.target.files?.[ 0 ];
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
		if ( ! importFile ) {
			return;
		}
		const fileReader = new window.FileReader();
		fileReader.readAsText( importFile, 'UTF-8' );

		fileReader.onload = ( event ) => {
			try {
				const result = event.target?.result;
				const data = JSON.parse( typeof result === 'string' ? result : '' );
				setIsWaiting( true );

				// Update editor config.
				apiFetch< { editorSettings: EditorSettings; editorOptions: EditorOptions } >( {
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
			} catch {
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
			<Stack direction="column" align="start" gap="lg">
				<Text render={ <p /> }>
					{ __(
						'Select the Custom HTML Block Extension JSON file you would like to import and click the import button below.',
						'custom-html-block-extension'
					) }
				</Text>
				<Stack justify="start" wrap="wrap" gap="lg">
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
				</Stack>
				<Button
					variant="primary"
					disabled={ ! importFile }
					onClick={ onImportOptions }
					__next40pxDefaultSize
					__experimentalIsFocusable
				>
					{ __( 'Import', 'custom-html-block-extension' ) }
				</Button>
			</Stack>
		</PanelBody>
	);
}
