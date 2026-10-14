/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import registerWpHtmlTokenizer from './wp-html-tokenizer';
import registerWpBlockDelimiters from './wp-block-delimiters';

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

// The time until loading the editor is considered failed. The editor script is
// several megabytes, so allow enough time for slow connections.
const LOADING_TIMEOUT = 30 * 1000;

// The loading promise for each window, which all editors in the window share.
const loadingPromises = new WeakMap< Window, Promise< typeof Monaco > >();

// Wrap promise to make it cancelable.
function makeCancelable< T >( promise: Promise< T > ): CancelablePromise< T > {
	let hasCanceled = false;
	const canceledMessage: LoaderError = {
		type: 'cancelation',
		msg: __( 'Operation is cancelled.', 'custom-html-block-extension' ),
	};
	const wrappedPromise = new Promise< T >( ( resolve, reject ) => {
		promise.then(
			( val ) => ( hasCanceled ? reject( canceledMessage ) : resolve( val ) ),
			( error ) => ( hasCanceled ? reject( canceledMessage ) : reject( error ) )
		);
	} ) as CancelablePromise< T >;
	wrappedPromise.cancel = () => {
		hasCanceled = true;
	};
	return wrappedPromise;
}

// Load the monaco editor script into the window.
function loadMonaco( targetWindow: Window ): Promise< typeof Monaco > {
	return new Promise< typeof Monaco >( ( resolve, reject ) => {
		// Return monaco instance if it is mounted in the current window.
		if ( targetWindow.monaco?.editor ) {
			return resolve( targetWindow.monaco );
		}

		// It will be considered a read failure when a certain amount of time has passed.
		const timeout = setTimeout( () => {
			reject( {
				type: 'timeout',
				msg: __( 'Editor loading timed out.', 'custom-html-block-extension' ),
			} satisfies LoaderError );
		}, LOADING_TIMEOUT );

		const scriptError: LoaderError = {
			type: 'scripterror',
			msg: __( 'Failed to load the editor script.', 'custom-html-block-extension' ),
		};

		// Load monaco editor script.
		const script = targetWindow.document.createElement( 'script' );
		script.src = `${ config.paths.vs }/loader.js`;

		script.onload = () => {
			const require = targetWindow.require;
			require.config( config );
			require( [ 'vs/editor/editor.main' ], () => {
				clearTimeout( timeout );
				const { monaco } = targetWindow;
				if ( ! monaco ) {
					return reject( scriptError );
				}
				registerWpHtmlTokenizer( monaco );
				registerWpBlockDelimiters( monaco );
				return resolve( monaco );
			} );
		};

		script.onerror = () => {
			clearTimeout( timeout );
			return reject( scriptError );
		};

		targetWindow.document.body.appendChild( script );
	} );
}

/**
 * Custom monaco editor loader which is a customized version of `@monaco-editor/loader`.
 *
 * @param targetWindow The window object to load the editor.
 * @see https://github.com/suren-atoyan/monaco-loader
 */
export default function initLoader(
	targetWindow: Window = window
): CancelablePromise< typeof Monaco > {
	let promise = loadingPromises.get( targetWindow );
	if ( ! promise ) {
		promise = loadMonaco( targetWindow );
		loadingPromises.set( targetWindow, promise );
		// Allow retrying in a new editor when loading fails.
		promise.catch( () => loadingPromises.delete( targetWindow ) );
	}
	return makeCancelable( promise );
}
