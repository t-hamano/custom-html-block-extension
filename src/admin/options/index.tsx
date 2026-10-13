/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Button, Stack } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../index';
import { updateSettings } from '../api';
import PermissionEditor from './components/permission-editor';
import PermissionUserRole from './components/permission-user-role';

export default function Options() {
	const { isWaiting, options, setIsWaiting } = useContext( AdminContext );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	// Update options.
	const onUpdateOptions = async () => {
		setIsWaiting( true );

		try {
			await updateSettings( { options } );
			// Keep the spinner visible briefly so it does not flash on fast responses.
			await new Promise( ( resolve ) => setTimeout( resolve, 600 ) );
			createSuccessNotice( __( 'Options saved.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
		} catch ( error ) {
			createErrorNotice( ( error as Error ).message, { type: 'snackbar' } );
		} finally {
			setIsWaiting( false );
		}
	};

	return (
		<Stack direction="column" gap="lg">
			<PermissionEditor />
			<PermissionUserRole />
			<Stack gap="sm">
				<Button disabled={ isWaiting } onClick={ onUpdateOptions }>
					{ __( 'Save Options', 'custom-html-block-extension' ) }
				</Button>
			</Stack>
		</Stack>
	);
}
