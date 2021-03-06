/**
 * External dependencies
 */
import { Store } from 'react-notifications-component';

export const addNotification = ( message, type, duration = 2000 ) => {
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

// Sample code based on indent type and tab size settings.
export const htmlCode = () => {
	let str = `<div class="container">
	<h2 class="title">Hello World</h2>
	<div class="row">
		<div class="col">
			<h3 class="subheading">Subtitle</h3>
			<img src="image.png" alt="WordPress" width="470" height="317">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
		<div class="col">
			<h3 class="subheading">Subtitle</h3>
			<img src="image.png" alt="WordPress" width="470" height="317">
			<a href="https://wordpress.org/" target="_blank">WordPress.org</a>
		</div>
	</div>
</div>
`;

	const { editorSettings } = chbeObj;
	if ( editorSettings.insertSpaces && editorSettings.tabSize ) {
		str = str.replace( /\t/gm, ' '.repeat( chbeObj.editorSettings.tabSize ) );
	}
	return str;
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
