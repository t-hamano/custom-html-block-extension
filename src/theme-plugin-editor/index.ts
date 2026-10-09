/**
 * External dependencies
 */
import webfontloader from 'webfontloader';
import { emmetHTML, emmetCSS } from 'emmet-monaco-es';
import type * as Monaco from 'monaco-editor';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { debounce } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import './style.scss';
import themes from '../lib/themes';
import initLoader from '../lib/loader';

/**
 * Create a function that loads a JSON schema on schemas.wp.org through the REST API,
 * since schemas.wp.org doesn't return CORS headers. Each URL is requested only once.
 *
 * @param monaco The monaco instance.
 * @return Function that receives the content of the JSON file.
 */
function createJsonSchemaLoader( monaco: typeof Monaco ) {
	const requestedUrls = new Set< string >();

	return ( content: string ) => {
		const url = content.match( /"\$schema"\s*:\s*"(https:\/\/schemas\.wp\.org\/[^"]+)"/ )?.[ 1 ];
		if ( ! url || requestedUrls.has( url ) ) {
			return;
		}
		requestedUrls.add( url );

		apiFetch( {
			path: `/custom-html-block-extension/v1/get_json_schema?url=${ encodeURIComponent( url ) }`,
		} )
			.then( ( schema ) => {
				const { diagnosticsOptions } = monaco.json.jsonDefaults;
				monaco.json.jsonDefaults.setDiagnosticsOptions( {
					...diagnosticsOptions,
					schemas: [ ...( diagnosticsOptions.schemas ?? [] ), { uri: url, schema } ],
				} );
			} )
			.catch( () => {} );
	};
}

initLoader()
	.then( ( monaco ) => {
		if ( ! monaco ) {
			return;
		}

		const { editorSettings, editorOptions, language, fontFamily } = window.chbeObj;
		const { theme, tabSize, insertSpaces, emmet } = editorSettings;

		const textarea = document.getElementById( 'newcontent' ) as HTMLTextAreaElement | null;
		if ( ! textarea ) {
			return;
		}

		// Generate an element to apply the monaco editor.
		const monacoEditorContainer = document.createElement( 'div' );
		monacoEditorContainer.setAttribute( 'id', 'monaco-editor' );
		textarea.parentNode?.insertBefore( monacoEditorContainer, textarea.nextElementSibling );

		// Monaco editor properties.
		const properties = {
			theme,
			value: textarea.value,
			language,
			automaticLayout: true,
			...editorOptions,
		};

		// Create monaco editor.
		const editor = monaco.editor.create(
			monacoEditorContainer,
			properties as Monaco.editor.IStandaloneEditorConstructionOptions
		);
		window.editor = editor;

		// Event emitted when the contents of the editor have changed.
		editor.getModel()?.onDidChangeContent( () => {
			// Apply changes in the editor to the original textarea.
			const editorValue = editor.getModel()?.getValue();
			if ( editorValue === undefined || textarea.value === editorValue ) {
				return;
			}
			textarea.value = editorValue;
			// Update the dirty state to display an alert when leaving the page.
			const wp = window.wp as { themePluginEditor?: { dirty: boolean } } | undefined;
			if ( wp?.themePluginEditor ) {
				wp.themePluginEditor.dirty = true;
			}
		} );

		// Load the JSON schema specified by `$schema`, such as theme.json, and load it again
		// when `$schema` is changed. Wait until typing stops so that a URL being typed isn't requested.
		if ( 'json' === language ) {
			const loadJsonSchema = createJsonSchemaLoader( monaco );
			loadJsonSchema( textarea.value );

			editor
				.getModel()
				?.onDidChangeContent( debounce( () => loadJsonSchema( editor.getValue() ), 500 ) );
		}

		// Enable Emmet.
		if ( emmet && language ) {
			if ( language.match( /htm|php/ ) ) {
				emmetHTML( monaco, [ 'html', 'php' ] );
			} else if ( language.match( /sass|scss|css|less/ ) ) {
				emmetCSS( monaco, [ 'sass', 'scss', 'css', 'less' ] );
			}
		}

		// Update editor settings.
		if ( 'vs-dark' !== theme && 'light' !== theme ) {
			const targetTheme = themes.find( ( data ) => theme === data.value );
			if ( undefined !== targetTheme ) {
				monaco.editor.defineTheme( targetTheme.value, targetTheme.data );
				monaco.editor.setTheme( targetTheme.value );
			}
		}

		editor.getModel()?.updateOptions( {
			tabSize,
			insertSpaces,
		} );

		// Load webfont.
		const font = fontFamily.find( ( data ) => editorOptions.fontFamily === data.name );

		if ( undefined !== font && 'label' in font ) {
			const webfontConfig: WebFont.Config = {
				timeout: 5000,
				custom: {
					families: [ font.name ],
				},
				active: () => monaco.editor.remeasureFonts(),
			};

			if ( 'stylesheet' in font && font.stylesheet ) {
				webfontConfig.custom!.urls = [ font.stylesheet ];
			}

			webfontloader.load( webfontConfig );
		}
	} )
	.catch( ( error ) => {
		if ( error?.msg ) {
			// eslint-disable-next-line no-console
			console.error( error.msg );
		}
	} );
