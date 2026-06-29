/**
 * External dependencies
 */
import webfontloader from 'webfontloader';
import { emmetHTML, emmetCSS } from 'emmet-monaco-es';
import type * as Monaco from 'monaco-editor';

/**
 * Internal dependencies
 */
import './style.scss';
import themes from '../lib/themes';
import initLoader from '../lib/loader';

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
				monaco.editor.defineTheme(
					targetTheme.value,
					targetTheme.data as unknown as Monaco.editor.IStandaloneThemeData
				);
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
