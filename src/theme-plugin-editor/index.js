/**
 * External dependencies
 */
import loader from '@monaco-editor/loader';
import webfontloader from 'webfontloader';
import { emmetHTML, emmetCSS } from 'emmet-monaco-es';

/**
 * Internal dependencies
 */
import themes from 'themes';

loader.init().then( monaco => {
	const textarea = document.getElementById( 'newcontent' );
	// Setting up the monaco editor.
	const runEditor = () => {

		// Generate an element to apply the monaco editor.
		const monacoEditorContainer = document.createElement( 'div' );
		monacoEditorContainer.setAttribute( 'id', 'monaco-editor-container' );
		textarea.parentNode.insertBefore( monacoEditorContainer, textarea.nextElementSibling );

		// Monaco editor properties.
		const properties = {
			theme: chbeObj.editorSettings.theme,
			value: textarea.value,
			language: chbeObj.language,
			automaticLayout: true,
			...chbeObj.editorOptions
		};

		// Create monaco editor.
		window.editor = monaco.editor.create(
			monacoEditorContainer,
			properties,
		);

		// Event emitted when the contents of the editor have changed.
		window.editor.getModel().onDidChangeContent( () => {
			// Apply changes in the editor to the original textarea.
			const editorValue = window.editor.getModel().getValue();
			if ( textarea.value === editorValue ) {
				return;
			}
			textarea.value = editorValue;
		});

		// Enable Emmet.
		if ( chbeObj.editorSettings.emmet ) {
			if ( chbeObj.language.match( /htm|php/ ) ) {
				emmetHTML();
			} else if ( chbeObj.language.match( /sass|scss|css|less/ ) ) {
				emmetCSS();
			}
		}

		// Update editor settings.
		if ( 'vs-dark' !== chbeObj.editorSettings.theme && 'light' !== chbeObj.editorSettings.theme ) {
			const theme = themes.find( ( data ) => chbeObj.editorSettings.theme === data.value );
			if ( undefined !== theme ) {
				monaco.editor.defineTheme( theme.value, theme.data );
				monaco.editor.setTheme( theme.value );
			}
		}

		window.editor.getModel().updateOptions({
			tabSize: chbeObj.editorSettings.tabSize,
			insertSpaces: chbeObj.editorSettings.insertSpaces
		});

		// Load webfont.
		const font = chbeObj.fontFamily.find( ( data ) => chbeObj.editorOptions.fontFamily === data.name );

		if ( undefined !== font && 'label' in font ) {
			const webfontConfig = {
				custom: {
					families: [ font.name ]
				}
			};

			if ( 'stylesheet' in font ) {
				webfontConfig.custom.urls = [ font.stylesheet ];
			}

			webfontloader.load({
				timeout: 2000,
				...webfontConfig,
				active: () => {

					// Adjust the position of the cursor and space.
					monaco.editor.remeasureFonts();
				}
			});
		}
	};

	// Initialize
	runEditor();
});
