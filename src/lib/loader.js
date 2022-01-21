const config = {
	paths: {
		vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.30.1/min/vs',
	},
};

function makeCancelable( promise ) {
	let hasCanceled_ = false;
	const wrappedPromise = new Promise( ( resolve, reject ) => {
		promise.then( ( val ) => ( hasCanceled_ ? reject( { isCanceled: true } ) : resolve( val ) ) );
		promise.catch( reject );
	} );
	return ( wrappedPromise.cancel = () => ( hasCanceled_ = true ) ), wrappedPromise;
}

function init( targetWindow = window ) {
	const promise = new Promise( ( resolve, reject ) => {
		if ( targetWindow.monaco && targetWindow.monaco.editor ) {
			return resolve( targetWindow.monaco );
		}

		const script = targetWindow.document.createElement( 'script' );
		script.src = `${ config.paths.vs }/loader.js`;

		script.onload = () => {
			const require = targetWindow.require;
			require.config( config );
			require( [ 'vs/editor/editor.main' ], ( monaco ) => {
				return resolve( monaco );
			}, ( error ) => {
				return reject( error );
			} );
		};

		script.onerror = () => reject();

		targetWindow.document.body.appendChild( script );
	} );

	return makeCancelable( promise );
}

export default { init };
