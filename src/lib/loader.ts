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

// The time until loading the editor is reported as timed out. The editor script is
// several megabytes, so allow enough time for slow connections.
const LOADING_TIMEOUT = 30 * 1000;

// The loading promise for each window, which all editors in the window share.
// The document is kept to detect that the window has navigated to a new document,
// which resets `window.monaco`.
const loadingPromises = new WeakMap<
	Window,
	{ document: Document; promise: Promise< typeof Monaco > }
>();

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
			return reject( scriptError );
		};

		targetWindow.document.body.appendChild( script );
	} );
}

/**
 * Custom monaco editor loader which is a customized version of `@monaco-editor/loader`.
 *
 * The returned promise rejects when loading takes too long, but loading continues,
 * so calling this function again waits for the same loading.
 *
 * @param targetWindow The window object to load the editor.
 * @see https://github.com/suren-atoyan/monaco-loader
 */
export default function initLoader(
	targetWindow: Window = window
): CancelablePromise< typeof Monaco > {
	let entry = loadingPromises.get( targetWindow );
	if ( ! entry || entry.document !== targetWindow.document ) {
		const promise = loadMonaco( targetWindow );
		entry = { document: targetWindow.document, promise };
		loadingPromises.set( targetWindow, entry );
		// Allow retrying in a new editor when loading fails.
		promise.catch( () => {
			if ( loadingPromises.get( targetWindow )?.promise === promise ) {
				loadingPromises.delete( targetWindow );
			}
		} );
	}

	const { promise } = entry;
	const timedPromise = new Promise< typeof Monaco >( ( resolve, reject ) => {
		const timeout = setTimeout( () => {
			reject( {
				type: 'timeout',
				msg: __( 'Editor loading timed out.', 'custom-html-block-extension' ),
			} satisfies LoaderError );
		}, LOADING_TIMEOUT );
		promise.then( resolve, reject ).finally( () => clearTimeout( timeout ) );
	} );

	return makeCancelable( timedPromise );
}
