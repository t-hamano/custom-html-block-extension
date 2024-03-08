/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const config = {
	paths: {
		vs: `${ window.chbeObj.pluginUrl }/build/vendor/monaco-editor/min/vs`,
	},
};

// Wrap promise to make it cancelable.
function makeCancelable( promise ) {
	let hasCanceled_ = false;
	const canceledMessage = {
		type: 'cancelation',
		msg: __( 'Operation is cancelled.', 'custom-html-block-extension' ),
	};
	const wrappedPromise = new Promise( ( resolve, reject ) => {
		promise.then( ( val ) => ( hasCanceled_ ? reject( canceledMessage ) : resolve( val ) ) );
		promise.catch( reject );
	} );
	return ( wrappedPromise.cancel = () => ( hasCanceled_ = true ) ), wrappedPromise;
}

/**
 * Custom monaco editor loader which is a customized version of @monaco-editor/loader.
 *
 * @param {Object} targetWindow The window object to load the editor.
 * @see https://github.com/suren-atoyan/monaco-loader
 */
export default function initLoader( targetWindow = window ) {
	const promise = new Promise( ( resolve, reject ) => {
		// It will be considered a read failure when a certain amount of time has passed.
		const timeout = setTimeout( () => {
			return reject( {
				type: 'timeout',
				msg: __( 'Editor loading timed out.', 'custom-html-block-extension' ),
			} );
		}, 5 * 10000 );

		// Return nothing and resolve promise when the initialization process has started.
		if ( targetWindow.isInitialized ) {
			clearTimeout( timeout );
			return resolve();
		}

		// Return monaco instance if it is mounted in the current window.
		if ( targetWindow?.monaco?.editor ) {
			clearTimeout( timeout );
			return resolve( targetWindow.monaco );
		}

		// Load monaco editor script.
		const script = targetWindow.document.createElement( 'script' );
		script.src = `${ config.paths.vs }/loader.js`;

		script.onload = () => {
			const require = targetWindow.require;
			require.config( config );
			require( [ 'vs/editor/editor.main' ], ( monaco ) => {
				clearTimeout( timeout );
				return resolve( monaco );
			} );
		};

		script.onerror = () => {
			clearTimeout( timeout );
			return reject( {
				type: 'scripterror',
				msg: __( 'Failed to load the editor script.', 'custom-html-block-extension' ),
			} );
		};

		targetWindow.document.body.appendChild( script );
		targetWindow.isInitialized = true;
	} );

	return makeCancelable( promise );
}
