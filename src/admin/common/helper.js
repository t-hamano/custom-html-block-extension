/**
 * External dependencies
 */
import { store } from 'react-notifications-component';

export const addNotification = ( message, type, duration = 2000 ) => {
	store.addNotification( {
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

export const rTabs = ( str ) => {
	str = str.trim();

	if ( chbeObj.editorSettings.insertSpaces ) {
		str = str.replace( /\t/gm, ' '.repeat( chbeObj.editorSettings.tabSize ) );
	}

	return str;
};
