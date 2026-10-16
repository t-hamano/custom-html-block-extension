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

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { importVSCodeSettings } from './utils';

export default function VSCodeImportTool() {
	const {
		editorSettings,
		editorOptions,
		isWaiting,
		setEditorSettings,
		setEditorOptions,
		setIsWaiting,
	} = useContext( AdminContext );

	const [ settingsText, setSettingsText ] = useState( '' );
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

	// Import the VS Code settings as unsaved changes, so that they can be
	// checked in the preview before saving.
	const onImport = async () => {
		const result = importVSCodeSettings( settingsText, editorSettings, editorOptions );

		if ( ! result ) {
			createErrorNotice(
				__( 'The format of the settings is not correct.', 'custom-html-block-extension' ),
				{ type: 'snackbar' }
			);
			return;
		}

		if ( result.importedCount === 0 ) {
			createErrorNotice( __( 'No supported settings were found.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
			return;
		}

		// Apply the settings before the delay, so that edits made while the
		// spinner is visible are not overwritten.
		setEditorSettings( result.editorSettings );
		setEditorOptions( result.editorOptions );
		setSettingsText( '' );
		setIsWaiting( true );
		// Show the spinner briefly, as when saving the settings.
		await new Promise( ( resolve ) => setTimeout( resolve, 600 ) );
		setIsWaiting( false );
		const { importedCount, skippedCount } = result;
		const message =
			skippedCount === 1
				? sprintf(
						/* translators: 1: Number of imported settings, 2: Number of skipped settings (1). */
						_n(
							'Imported %1$d setting and skipped %2$d setting. Check the preview and save the changes.',
							'Imported %1$d settings and skipped %2$d setting. Check the preview and save the changes.',
							importedCount,
							'custom-html-block-extension'
						),
						importedCount,
						skippedCount
					)
				: sprintf(
						/* translators: 1: Number of imported settings, 2: Number of skipped settings. */
						_n(
							'Imported %1$d setting and skipped %2$d settings. Check the preview and save the changes.',
							'Imported %1$d settings and skipped %2$d settings. Check the preview and save the changes.',
							importedCount,
							'custom-html-block-extension'
						),
						importedCount,
						skippedCount
					);
		createSuccessNotice( message, { type: 'snackbar' } );
	};

	return (
		<CollapsibleCard.Root defaultOpen>
			<CollapsibleCard.Header render={ <h2 /> }>
				<Card.Title>{ __( 'Import from VS Code', 'custom-html-block-extension' ) }</Card.Title>
			</CollapsibleCard.Header>
			<CollapsibleCard.Content>
				<Stack direction="column" align="start" gap="lg">
					<Text render={ <p /> }>
						{ __(
							'Paste the contents of the VS Code settings.json file or upload the file, and click the button below. You can open it in VS Code from the Command Palette with "Preferences: Open User Settings (JSON)".',
							'custom-html-block-extension'
						) }
					</Text>
					<Text render={ <p /> }>
						{ createInterpolateElement(
							sprintf(
								/* translators: 1: Path on Windows, 2: Path on macOS, 3: Path on Linux. */
								__(
									'The file is located in <code>%1$s</code> on Windows, <code>%2$s</code> on macOS and <code>%3$s</code> on Linux.',
									'custom-html-block-extension'
								),
								'%APPDATA%\\Code\\User\\',
								'~/Library/Application Support/Code/User/',
								'~/.config/Code/User/'
							),
							{ code: <code /> }
						) }
					</Text>
					<Notice.Root intent="info">
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
						className="chbe-admin-tools__vscode-settings"
						label={ __( 'settings.json', 'custom-html-block-extension' ) }
						value={ settingsText }
						onValueChange={ ( value: string ) => setSettingsText( value ) }
						rows={ 10 }
					/>
					<Button disabled={ isWaiting || ! settingsText.trim() } onClick={ onImport }>
						{ __( 'Import VS Code settings', 'custom-html-block-extension' ) }
					</Button>
				</Stack>
			</CollapsibleCard.Content>
		</CollapsibleCard.Root>
	);
}
