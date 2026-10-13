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
	const onUpdateOptions = () => {
		setIsWaiting( true );

		updateSettings( { options } )
			.then( () => {
				setTimeout( () => {
					createSuccessNotice( __( 'Options saved.', 'custom-html-block-extension' ), {
						type: 'snackbar',
					} );
					setIsWaiting( false );
				}, 600 );
			} )
			.catch( ( error: Error ) => {
				createErrorNotice( error.message, { type: 'snackbar' } );
				setIsWaiting( false );
			} );
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
