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

// The monaco editor bundle built from `src/monaco`.
const MONACO_URL = `${ window.chbeObj.pluginUrl }/build/monaco`;
const STYLE_ID = 'chbe-monaco-css';

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

// Load an element into the head of the document. The element is removed when it fails
// to load, so that loading it again retries it.
function loadElement( element: HTMLScriptElement | HTMLLinkElement ) {
	return new Promise< void >( ( resolve, reject ) => {
		element.onload = () => resolve();
		element.onerror = () => {
			element.remove();
			reject();
		};
		element.ownerDocument.head.appendChild( element );
	} );
}

// Load the monaco editor bundle into the window. The bundle is loaded into each window
// instead of being shared, so that monaco renders into and listens to the window it runs in.
function loadMonaco( targetWindow: Window ): Promise< typeof Monaco > {
	const scriptError: LoaderError = {
		type: 'scripterror',
		msg: __( 'Failed to load the editor script.', 'custom-html-block-extension' ),
	};

	const { document } = targetWindow;
	const version = encodeURIComponent( window.chbeObj.monacoVersion );
	const loading: Promise< void >[] = [];

	// Only load what hasn't been loaded yet, since one of them may have loaded
	// in a previous attempt that failed.
	if ( ! document.getElementById( STYLE_ID ) ) {
		const style = document.createElement( 'link' );
		style.id = STYLE_ID;
		style.rel = 'stylesheet';
		style.href = `${ MONACO_URL }/monaco.css?ver=${ version }`;
		loading.push( loadElement( style ) );
	}
	if ( ! targetWindow.monaco ) {
		const script = document.createElement( 'script' );
		script.src = `${ MONACO_URL }/monaco.js?ver=${ version }`;
		loading.push( loadElement( script ) );
	}

	// Wait for all of them to settle even if one fails, so that a retry sees which
	// of them loaded.
	return Promise.allSettled( loading ).then( ( results ) => {
		const { monaco } = targetWindow;
		if ( ! monaco || results.some( ( { status } ) => 'rejected' === status ) ) {
			throw scriptError;
		}
		// The block editor and text editor scripts each bundle this loader, so
		// register the extensions only once per window.
		if ( ! targetWindow.chbeHasMonacoExtensions ) {
			registerWpHtmlTokenizer( monaco );
			registerWpBlockDelimiters( monaco );
			targetWindow.chbeHasMonacoExtensions = true;
		}
		return monaco;
	} );
}

/**
 * Custom monaco editor loader which is a customized version of `@monaco-editor/loader`.
 *
 * @param targetWindow      The window object to load the editor.
 * @param options           Options.
 * @param options.onTimeout Called when loading takes too long. Loading continues after it,
 *                          since the editor may finish loading late on slow connections.
 * @see https://github.com/suren-atoyan/monaco-loader
 */
export default function initLoader(
	targetWindow: Window = window,
	{ onTimeout }: { onTimeout?: ( error: LoaderError ) => void } = {}
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

	const cancelable = makeCancelable( entry.promise );

	const timeout = setTimeout( () => {
		onTimeout?.( {
			type: 'timeout',
			msg: __( 'Editor loading timed out.', 'custom-html-block-extension' ),
		} );
	}, LOADING_TIMEOUT );
	const clearLoadingTimeout = () => clearTimeout( timeout );
	entry.promise.then( clearLoadingTimeout, clearLoadingTimeout );

	const cancel = cancelable.cancel;
	cancelable.cancel = () => {
		clearLoadingTimeout();
		cancel();
	};
	return cancelable;
}
