/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { createContext, useContext } from '@wordpress/element';
import { Button, Flex, __experimentalVStack as VStack } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../index';
import PermissionEditor from './components/permission-editor';
import PermissionUserRole from './components/permission-user-role';

/**
 * Context
 */
export const OptionsContext = createContext();

export default function Options() {
	const { isWaiting, options, setIsWaiting } = useContext( AdminContext );
	const { createNotice } = useDispatch( noticesStore );

	// Update editor config.
	const onUpdateOptions = () => {
		setIsWaiting( true );

		apiFetch( {
			path: '/custom-html-block-extension/v1/update_options',
			method: 'POST',
			data: { options },
		} ).then( ( response ) => {
			setTimeout( () => {
				createNotice( response.success ? 'success' : 'error', response.message, {
					type: 'snackbar',
				} );
				setIsWaiting( false );
			}, 600 );
		} );
	};

	return (
		<VStack spacing={ 4 }>
			<PermissionEditor />
			<PermissionUserRole />
			<Flex>
				<Button
					variant="primary"
					disabled={ isWaiting }
					onClick={ onUpdateOptions }
					__next40pxDefaultSize
				>
					{ __( 'Save Options', 'custom-html-block-extension' ) }
				</Button>
			</Flex>
		</VStack>
	);
}
