/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { Button, Card, CollapsibleCard, Stack, Text, TextareaControl } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { importVSCodeSettings } from './utils';

export default function VSCodeImportTool() {
	const { editorSettings, editorOptions, setEditorSettings, setEditorOptions, setSelectedTab } =
		useContext( AdminContext );

	const [ settingsText, setSettingsText ] = useState( '' );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	// Import the VS Code settings as unsaved changes, so that they can be
	// checked in the preview before saving.
	const onImport = () => {
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

		setEditorSettings( result.editorSettings );
		setEditorOptions( result.editorOptions );
		setSettingsText( '' );
		setSelectedTab( 'editor-config' );
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
							'Paste the contents of the VS Code settings.json file and click the button below. You can open it in VS Code from the Command Palette with "Preferences: Open User Settings (JSON)".',
							'custom-html-block-extension'
						) }
					</Text>
					<Text render={ <p /> }>
						{ __(
							'Not all VS Code settings are supported. Unsupported settings will not be imported.',
							'custom-html-block-extension'
						) }
					</Text>
					<TextareaControl
						className="chbe-admin-tools__vscode-settings"
						label={ __( 'settings.json', 'custom-html-block-extension' ) }
						value={ settingsText }
						onValueChange={ ( value: string ) => setSettingsText( value ) }
						rows={ 10 }
					/>
					<Button disabled={ ! settingsText.trim() } onClick={ onImport }>
						{ __( 'Import VS Code settings', 'custom-html-block-extension' ) }
					</Button>
				</Stack>
			</CollapsibleCard.Content>
		</CollapsibleCard.Root>
	);
}
