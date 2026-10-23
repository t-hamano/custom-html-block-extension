/**
 * External dependencies
 */
import type { ChangeEvent } from 'react';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { createInterpolateElement, useContext, useState } from '@wordpress/element';
import { FormFileUpload } from '@wordpress/components';
import { Button, Card, CollapsibleCard, Notice, Stack, Text, TextareaControl } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import {
	buildEditorConfig,
	countEditorConfig,
	getImportItems,
	mergeEditorOptions,
	parseEditorConfig,
	type ImportItem,
} from '../../utils';
import { validateEditorConfig } from '../../../api';
import ImportConfirmDialog from './confirm-dialog';

function getSettingsFolder() {
	if ( isAppleOS() ) {
		return '~/Library/Application Support/Code/User/';
	}
	if ( window.navigator.platform.includes( 'Linux' ) ) {
		return '~/.config/Code/User/';
	}
	return '%APPDATA%\\Code\\User\\';
}

export default function ImportTool() {
	const {
		editorSettings,
		editorOptions,
		isWaiting,
		setEditorSettings,
		setEditorOptions,
		setIsWaiting,
	} = useContext( AdminContext );

	const [ settingsText, setSettingsText ] = useState( '' );
	const [ confirmation, setConfirmation ] = useState< {
		items: ImportItem[];
		skipped: { path: string; code: string; message: string }[];
	} | null >( null );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	// Load the file into the text area. The MIME type of a `.json` file can be
	// empty in some environments, so check the extension instead.
	const onUploadFile = async ( event: ChangeEvent< HTMLInputElement > ) => {
		const file = event.target.files?.[ 0 ];
		event.target.value = '';
		if ( ! file ) {
			return;
		}
		if ( ! file.name.toLowerCase().endsWith( '.json' ) ) {
			createErrorNotice( __( 'It is not a JSON file.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
			return;
		}
		setSettingsText( await file.text() );
	};

	// Validate the settings on the server, then show the values that differ from
	// the current ones in the confirmation dialog.
	const onImport = async () => {
		const editorConfig = parseEditorConfig( settingsText, editorOptions );

		if ( ! editorConfig ) {
			createErrorNotice(
				__( 'The format of the settings is not correct.', 'custom-html-block-extension' ),
				{ type: 'snackbar' }
			);
			return;
		}

		setIsWaiting( true );
		const result = await validateEditorConfig( editorConfig ).catch( ( error: Error ) => {
			createErrorNotice( error.message, { type: 'snackbar' } );
			return null;
		} );
		if ( ! result ) {
			setIsWaiting( false );
			return;
		}

		// Keep the spinner visible briefly so it does not flash on fast responses.
		await new Promise( ( resolve ) => setTimeout( resolve, 600 ) );
		setIsWaiting( false );

		if ( countEditorConfig( result ) === 0 ) {
			createErrorNotice( __( 'No supported settings were found.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
			return;
		}

		const items = getImportItems( editorConfig, result, { editorSettings, editorOptions } );
		if ( items.length === 0 ) {
			createSuccessNotice(
				__(
					'The imported settings are the same as the current ones.',
					'custom-html-block-extension'
				),
				{ type: 'snackbar' }
			);
			return;
		}

		setConfirmation( { items, skipped: result.skipped } );
	};

	// Apply the selected settings as unsaved changes, so that they can be
	// checked in the preview before saving.
	const onApply = ( items: ImportItem[] ) => {
		const editorConfig = buildEditorConfig( items );
		setEditorSettings( ( current ) => ( { ...current, ...editorConfig.editorSettings } ) );
		setEditorOptions( ( current ) => mergeEditorOptions( current, editorConfig.editorOptions ) );
		setSettingsText( '' );
		setConfirmation( null );
		createSuccessNotice(
			sprintf(
				/* translators: %d: Number of applied settings. */
				_n(
					'Applied %d setting. Check the preview and save the changes.',
					'Applied %d settings. Check the preview and save the changes.',
					items.length,
					'custom-html-block-extension'
				),
				items.length
			),
			{ type: 'snackbar' }
		);
	};

	return (
		<CollapsibleCard.Root defaultOpen>
			<CollapsibleCard.Header render={ <h2 /> }>
				<Card.Title>{ __( 'Import editor config', 'custom-html-block-extension' ) }</Card.Title>
			</CollapsibleCard.Header>
			<CollapsibleCard.Content>
				<Stack direction="column" align="start" gap="lg">
					<Text render={ <p /> }>
						{ __(
							'Paste the contents of an exported file or the VS Code settings.json file, or upload the file, and click the button below. You can open settings.json in VS Code from the Command Palette with "Preferences: Open User Settings (JSON)".',
							'custom-html-block-extension'
						) }
					</Text>
					<Text render={ <p /> }>
						{ createInterpolateElement(
							sprintf(
								/* translators: %s: Path to the folder containing settings.json. */
								__(
									'The settings.json file is located in <code>%s</code>.',
									'custom-html-block-extension'
								),
								getSettingsFolder()
							),
							{ code: <code /> }
						) }
					</Text>
					<Notice.Root intent="info" style={ { width: '100%' } }>
						<Notice.Description>
							{ __(
								'Not all VS Code settings are supported. Unsupported settings will not be imported.',
								'custom-html-block-extension'
							) }
						</Notice.Description>
					</Notice.Root>
					<FormFileUpload
						accept=".json"
						onChange={ onUploadFile }
						render={ ( { openFileDialog } ) => (
							<Button variant="outline" onClick={ openFileDialog }>
								{ __( 'Upload file', 'custom-html-block-extension' ) }
							</Button>
						) }
					/>
					<TextareaControl
						className="chbe-admin-tools__import-settings"
						label={ __( 'Settings (JSON)', 'custom-html-block-extension' ) }
						value={ settingsText }
						onValueChange={ ( value: string ) => setSettingsText( value ) }
						rows={ 10 }
					/>
					<Button disabled={ isWaiting || ! settingsText.trim() } onClick={ onImport }>
						{ __( 'Import', 'custom-html-block-extension' ) }
					</Button>
				</Stack>
				{ confirmation && (
					<ImportConfirmDialog
						items={ confirmation.items }
						skipped={ confirmation.skipped }
						onApply={ onApply }
						onClose={ () => setConfirmation( null ) }
					/>
				) }
			</CollapsibleCard.Content>
		</CollapsibleCard.Root>
	);
}
