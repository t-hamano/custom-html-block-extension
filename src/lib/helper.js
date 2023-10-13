/**
 * External dependencies
 */
import { Store } from 'react-notifications-component';

// Show Notification.
export const addNotification = ( message, type, duration = 200000 ) => {
	Store.addNotification( {
		message,
		type,
		animation: 'bounce-in',
		insert: 'bottom',
		container: 'top-center',
		isMobile: true,
		dismiss: {
			duration,
			showIcon: true,
		},
		dismissable: {
			click: true,
			touch: true,
		},
	} );
};

// Round values to the specified minimum and maximum values.
export const toNumber = ( value, min = 0, max = null ) => {
	value = Number( value );

	if ( isNaN( value ) || value < min ) {
		value = min;
	}

	if ( null !== max && value > max ) {
		value = max;
	}

	return value;
};
