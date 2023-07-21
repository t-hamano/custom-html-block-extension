/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { createContext, useContext } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../index';
import { addNotification } from '../../lib/helper';
import Permission from './components/permission';

/**
 * Context
 */
export const OptionsContext = createContext();

export default function Options() {
	const { isWaiting, options, setIsWaiting } = useContext( AdminContext );

	// Update editor config.
	const onUpdateOptions = () => {
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
		<div className="chbe-admin-options">
			<Permission />
			<Button variant="primary" disabled={ isWaiting } onClick={ onUpdateOptions }>
				{ __( 'Save Options', 'custom-html-block-extension' ) }
			</Button>
		</div>
	);
}
