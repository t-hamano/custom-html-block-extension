/**
 * External dependencies
 */
import webfontloader from 'webfontloader';
import { emmetHTML, emmetCSS } from 'emmet-monaco-es';

/**
 * Internal dependencies
 */
import './style.scss';
import themes from '../lib/themes';
import initLoader from '../lib/loader';

initLoader().then( ( monaco ) => {
	const { editorSettings, editorOptions, language, fontFamily } = window.chbeObj;
	const { theme, tabSize, insertSpaces, emmet } = editorSettings;

	const textarea = document.getElementById( 'newcontent' );

	// Generate an element to apply the monaco editor.
	const monacoEditorContainer = document.createElement( 'div' );
	monacoEditorContainer.setAttribute( 'id', 'monaco-editor-container' );
	textarea.parentNode.insertBefore( monacoEditorContainer, textarea.nextElementSibling );

	// Monaco editor properties.
	const properties = {
		theme,
		value: textarea.value,
		language,
		automaticLayout: true,
		...editorOptions,
	};

	// Create monaco editor.
	window.editor = monaco.editor.create( monacoEditorContainer, properties );

	// Event emitted when the contents of the editor have changed.
	window.editor.getModel().onDidChangeContent( () => {
		// Apply changes in the editor to the original textarea.
		const editorValue = window.editor.getModel().getValue();
		if ( textarea.value === editorValue ) {
			return;
		}
		textarea.value = editorValue;
	} );

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

	window.editor.getModel().updateOptions( {
		tabSize,
		insertSpaces,
	} );

	// Load webfont.
	const font = fontFamily.find( ( data ) => editorOptions.fontFamily === data.name );

	if ( undefined !== font && 'label' in font ) {
		const webfontConfig = {
			timeout: 5000,
			custom: {
				families: [ font.name ],
			},
			active: () => monaco.editor.remeasureFonts(),
		};

		if ( 'stylesheet' in font ) {
			webfontConfig.custom.urls = [ font.stylesheet ];
		}

		webfontloader.load( webfontConfig );
	}
} );
