/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Button, Card, CollapsibleCard, Stack, Text } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { getSettings } from '../../../api';
import { exportEditorConfig } from '../../utils';

export default function ExportTool() {
	const { setIsWaiting } = useContext( AdminContext );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	// Export editor config.
	const onExportOptions = async () => {
		setIsWaiting( true );

		try {
			const { editorSettings, editorOptions } = await getSettings();
			const date = new Date();
			const fileDate =
				date.getFullYear() +
				'-' +
				( '0' + ( date.getMonth() + 1 ) ).slice( -2 ) +
				'-' +
				( '0' + date.getDate() ).slice( -2 );
			const json = JSON.stringify(
				exportEditorConfig( editorSettings, editorOptions ),
				null,
				'\t'
			);
			const blob = new window.Blob( [ json ], { type: 'application/json' } );
			const href = URL.createObjectURL( blob );
			const link = document.createElement( 'a' );
			link.href = href;
			link.download = 'chbe-export-' + fileDate + '.json';
			document.body.appendChild( link );
			// Keep the spinner visible briefly so it does not flash on fast responses.
			await new Promise( ( resolve ) => setTimeout( resolve, 600 ) );
			link.click();
			document.body.removeChild( link );
			URL.revokeObjectURL( href );
			createSuccessNotice( __( 'Exported the editor config.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
		} catch ( error ) {
			createErrorNotice( ( error as Error ).message, { type: 'snackbar' } );
		} finally {
			setIsWaiting( false );
		}
	};

	return (
		<CollapsibleCard.Root defaultOpen>
			<CollapsibleCard.Header render={ <h2 /> }>
				<Card.Title>{ __( 'Export Editor Config', 'custom-html-block-extension' ) }</Card.Title>
			</CollapsibleCard.Header>
			<CollapsibleCard.Content>
				<Stack direction="column" align="start" gap="sm">
					<Text render={ <p /> }>
						{ __(
							'Use the download button to export the editor config. The file uses the same format as the VS Code settings.json, so you can import it on another WordPress site or copy the settings into VS Code.',
							'custom-html-block-extension'
						) }
					</Text>
					<Button onClick={ onExportOptions }>
						{ __( 'Export', 'custom-html-block-extension' ) }
					</Button>
				</Stack>
			</CollapsibleCard.Content>
		</CollapsibleCard.Root>
	);
}
