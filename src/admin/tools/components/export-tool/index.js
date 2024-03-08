/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useContext } from '@wordpress/element';
import { Button, PanelBody } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';

export default function ExportTool() {
	const { setIsWaiting } = useContext( AdminContext );

	// Export editor config.
	const onExportOptions = async () => {
		setIsWaiting( true );
		apiFetch( {
			path: '/custom-html-block-extension/v1/get_editor_config',
			method: 'POST',
		} ).then( async ( response ) => {
			const date = new Date();
			const fileDate =
				date.getFullYear() +
				'-' +
				( '0' + ( date.getMonth() + 1 ) ).slice( -2 ) +
				'-' +
				( '0' + date.getDate() ).slice( -2 );
			const json = JSON.stringify( response );
			const blob = new window.Blob( [ json ], { type: 'application/json' } );
			const href = await URL.createObjectURL( blob );
			const link = document.createElement( 'a' );
			link.href = href;
			link.download = 'chbe-export-' + fileDate + '.json';
			document.body.appendChild( link );

			setTimeout( () => {
				link.click();
				document.body.removeChild( link );
				setIsWaiting( false );
			}, 600 );
		} );
	};

	return (
		<PanelBody
			className="chbe-admin-tools-export-tool"
			title={ __( 'Export Editor Config', 'custom-html-block-extension' ) }
		>
			<p>
				{ __(
					'Use the download button to export the editor settings. You can restore the editor config by importing the exported file on another WordPress site.',
					'custom-html-block-extension'
				) }
			</p>
			<Button variant="primary" onClick={ onExportOptions } __next40pxDefaultSize>
				{ __( 'Export', 'custom-html-block-extension' ) }
			</Button>
		</PanelBody>
	);
}
