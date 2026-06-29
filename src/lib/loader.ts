/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

type LoaderError = {
	type: 'cancelation' | 'timeout' | 'scripterror';
	msg: string;
};

type CancelablePromise< T > = Promise< T > & { cancel: () => void };

const config = {
	paths: {
		vs: `${ window.chbeObj.pluginUrl }/build/vendor/monaco-editor/min/vs`,
	},
};

// Wrap promise to make it cancelable.
function makeCancelable< T >( promise: Promise< T > ): CancelablePromise< T > {
	let hasCanceled = false;
	const canceledMessage: LoaderError = {
		type: 'cancelation',
		msg: __( 'Operation is cancelled.', 'custom-html-block-extension' ),
	};
	const wrappedPromise = new Promise< T >( ( resolve, reject ) => {
		promise.then( ( val ) => ( hasCanceled ? reject( canceledMessage ) : resolve( val ) ) );
		promise.catch( reject );
	} ) as CancelablePromise< T >;
	wrappedPromise.cancel = () => {
		hasCanceled = true;
	};
	return wrappedPromise;
}

/**
 * Custom monaco editor loader which is a customized version of @monaco-editor/loader.
 *
 * @param targetWindow The window object to load the editor.
 * @see https://github.com/suren-atoyan/monaco-loader
 */
export default function initLoader(
	targetWindow: Window = window
): CancelablePromise< typeof Monaco | undefined > {
	const promise = new Promise< typeof Monaco | undefined >( ( resolve, reject ) => {
		// It will be considered a read failure when a certain amount of time has passed.
		const timeout = setTimeout( () => {
			return reject( {
				type: 'timeout',
				msg: __( 'Editor loading timed out.', 'custom-html-block-extension' ),
			} satisfies LoaderError );
		}, 5 * 10000 );

		// Return nothing and resolve promise when the initialization process has started.
		if ( targetWindow.isInitialized ) {
			clearTimeout( timeout );
			return resolve( undefined );
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
			require( [ 'vs/editor/editor.main' ], () => {
				clearTimeout( timeout );
				return resolve( targetWindow.monaco );
			} );
		};

		script.onerror = () => {
			clearTimeout( timeout );
			return reject( {
				type: 'scripterror',
				msg: __( 'Failed to load the editor script.', 'custom-html-block-extension' ),
			} satisfies LoaderError );
		};

		targetWindow.document.body.appendChild( script );
		targetWindow.isInitialized = true;
	} );

	return makeCancelable( promise );
}
