/**
 * Create the web workers for monaco. This module is imported before monaco so that
 * the environment is defined when monaco reads it.
 */
window.MonacoEnvironment = {
	getWorker( _workerId: string, label: string ) {
		switch ( label ) {
			case 'json':
				return new Worker(
					new URL( 'monaco-editor/languages/features/json/json.worker.js', import.meta.url )
				);
			case 'css':
			case 'scss':
			case 'less':
				return new Worker(
					new URL( 'monaco-editor/languages/features/css/css.worker.js', import.meta.url )
				);
			case 'html':
			case 'handlebars':
			case 'razor':
				return new Worker(
					new URL( 'monaco-editor/languages/features/html/html.worker.js', import.meta.url )
				);
			case 'typescript':
			case 'javascript':
				return new Worker(
					new URL( 'monaco-editor/languages/features/typescript/ts.worker.js', import.meta.url )
				);
			default:
				return new Worker( new URL( 'monaco-editor/editor/editor.worker.js', import.meta.url ) );
		}
	},
};
