/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { addNotification } from 'lib/helper';
import Permission from 'admin/options/permission';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { createContext, useContext } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Context
 */
export const OptionsContext = createContext();

const Options = () => {
	const { isWaiting, options, setIsWaiting } = useContext( AdminContext );

	// Update editor config.
	const handleUpdateOptions = () => {
		setIsWaiting( true );

		apiFetch( {
			path: '/custom-html-block-extension/v1/update_options',
			method: 'POST',
			data: { options },
		} ).then( ( response ) => {
			setTimeout( () => {
				addNotification( response.message, response.success ? 'success' : 'danger' );
				setIsWaiting( false );
			}, 600 );
		} );
	};

	return (
		<>
			<Permission />
			<Button isPrimary disabled={ isWaiting } onClick={ handleUpdateOptions }>
				{ __( 'Save Options', 'custom-html-block-extension' ) }
			</Button>
		</>
	);
};

export default Options;
