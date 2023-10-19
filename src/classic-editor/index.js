/**
 * External dependencies
 */
import webfontloader from 'webfontloader';
import { emmetHTML } from 'emmet-monaco-es';

/**
 * Internal dependencies
 */
import './style.scss';
import themes from '../lib/themes';
import initLoader from '../lib/loader';

initLoader().then( ( monaco ) => {
	let isMonacoEditorEnabled = false;

	const isEditorEnabled = null !== document.getElementById( 'content' );
	const isVisualEditorEnabled =
		null !== document.getElementById( 'content-tmce' ) &&
		null !== document.getElementById( 'content-html' );

	const cookieHtml = document.cookie.indexOf( 'editor%3Dhtml' );
	const cookieTinyMce = document.cookie.indexOf( 'editor%3Dtinymce' );
	const isVisualEditMode =
		( -1 === cookieHtml && -1 !== cookieTinyMce ) ||
		( -1 !== cookieHtml && -1 !== cookieTinyMce && cookieTinyMce > cookieHtml );

	const tabTmce = document.getElementById( 'content-tmce' );
	const tabHtml = document.getElementById( 'content-html' );
	const toolbar = document.getElementById( 'ed_toolbar' );
	const textarea = document.getElementById( 'content' );
	const editorContainer = document.getElementById( 'wp-content-editor-container' );
	const draftButton = document.getElementById( 'save-post' );
	const publishButton = document.getElementById( 'publish' );
	const replaceIndentButton = document.getElementById( 'chbe-replace-indent-button' );
	const syncTriggers = document.querySelectorAll(
		'.ed_button, .ui-button, #wp-link-url, #wp-link-text, #wp-link-submit, #wp-link-search'
	);

	// Setting up the monaco editor.
	const runEditor = () => {
		const { editorSettings, editorOptions, fontFamily } = window.chbeObj;
		const { theme, tabSize, insertSpaces, emmet } = editorSettings;

		// Generate an element to apply the monaco editor.
		const monacoEditorContainer = document.createElement( 'div' );
		monacoEditorContainer.setAttribute( 'id', 'monaco-editor-container' );
		editorContainer.appendChild( monacoEditorContainer );

		// Monaco editor properties.
		const properties = {
			theme,
			value: textarea.value,
			language: 'php',
			automaticLayout: true,
			...editorOptions,
			// Override some properties to match the classic editor.
			scrollBeyondLastLine: false,
			scrollbar: {
				...editorOptions.scrollbar,
				vertical: 'hidden',
				alwaysConsumeMouseWheel: false,
			},
		};

		// Create monaco editor.
		window.editor = monaco.editor.create( monacoEditorContainer, properties );

		// Change editor area height.
		const contentHeight = Math.max( 300, window.editor.getContentHeight() );
		monacoEditorContainer.style.height = `${ contentHeight }px`;

		// Event emitted when the contents of the editor have changed.
		window.editor.getModel().onDidChangeContent( () => {
			// Apply changes in the editor to the original textarea.
			const editorValue = window.editor.getModel().getValue();
			if ( textarea.value === editorValue ) {
				return;
			}
			textarea.value = editorValue;

			// Change editor area height.
			// eslint-disable-next-line no-shadow
			const contentHeight = Math.max( 300, window.editor.getContentHeight() );
			monacoEditorContainer.style.height = `${ contentHeight }px`;
		} );

		// Enable Emmet.
		if ( emmet ) {
			emmetHTML( monaco, [ 'html', 'php' ] );
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

		// Catch the Ctrl+S command to save draft or publish post.
		// eslint-disable-next-line no-bitwise
		window.editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
			!! draftButton ? draftButton.click() : publishButton.click();
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

		syncTriggers.forEach( ( button ) => {
			button.addEventListener( 'mouseup', syncTextareaToEditor );
			button.addEventListener( 'keydown', syncTextareaToEditor );
		} );

		window.addEventListener( 'resize', onWindowResize );

		updateToolbarMargin();
		isMonacoEditorEnabled = true;
	};

	// Add a margin above the monaco editor that is the same height as the toolbar.
	const updateToolbarMargin = () => {
		document.getElementById( 'monaco-editor-container' ).style.marginTop =
			toolbar.clientHeight + 'px';
	};

	// Window resize event.
	const onWindowResize = () => {
		setTimeout( () => {
			updateToolbarMargin();
		}, 300 );
	};

	// Apply changes in the original textarea to the editor.
	const syncTextareaToEditor = ( e ) => {
		if ( ! isMonacoEditorEnabled ) {
			return;
		}

		// Do nothing if keycode is not "enter" ( Tab key to move focus, etc ).
		if ( 'keydown' === e.type && 'Enter' !== e.key ) {
			return;
		}

		// Apply selection to the original textarea.
		const model = window.editor.getModel();
		const selection = window.editor.getSelection();
		const textareaSelection = getTextareaSelection( model, selection );

		textarea.setSelectionRange( textareaSelection.start, textareaSelection.end );

		// Apply changes in the original textarea to the editor.
		let checkCount = 0;
		const checkForChanges = window.setInterval( () => {
			if ( 100 === checkCount ) {
				window.clearInterval( checkForChanges );
			}
			if ( model.getValue() !== textarea.value ) {
				model.setValue( textarea.value );
				window.clearInterval( checkForChanges );
				const editorPosition = getEditorPosition( textarea );
				window.editor.setPosition( {
					lineNumber: editorPosition.lineNumber,
					column: editorPosition.column,
				} );
				window.editor.focus();
			}
			checkCount++;
		}, 100 );
	};

	// Get cursor selection info for the original textarea.
	const getTextareaSelection = ( model, selection ) => {
		const linesContent = model.getLinesContent();

		let start = 0;
		let end = 0;

		for ( let i = 1; i <= linesContent.length; i++ ) {
			const lineLength = model.getLineLength( i );

			if ( i === selection.startLineNumber ) {
				start += selection.startColumn + i - 2;
			} else if ( i < selection.startLineNumber ) {
				start += lineLength;
			}

			if ( i > selection.endLineNumber ) {
				break;
			}

			if ( i === selection.endLineNumber ) {
				end += selection.endColumn + i - 2;
			} else {
				end += lineLength;
			}
		}

		return { start, end };
	};

	// Get cursor position info for the editor.
	// eslint-disable-next-line no-shadow
	const getEditorPosition = ( textarea ) => {
		const linesContent = textarea.value.split( '\n' );
		let selectionStart = textarea.selectionStart;
		let lineNumber = 1;
		let column = 0;

		for ( let i = 0; i < linesContent.length; i++ ) {
			lineNumber = i + 1;

			if ( 0 >= selectionStart - linesContent[ i ].length ) {
				column = selectionStart - i + 1;
				break;
			} else if ( 0 === selectionStart - linesContent[ i ].length - i ) {
				column = selectionStart - i + 1;
				break;
			} else {
				selectionStart -= linesContent[ i ].length;
			}
		}

		return { lineNumber, column };
	};

	// Use observer to add event because "add media" modal window is added dynamically.
	const runObserve = () => {
		const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		if ( MutationObserver ) {
			new MutationObserver( () => {
				const mediaInsertButtons = Array.from(
					document.getElementsByClassName( 'media-button-insert' )
				);

				if ( mediaInsertButtons.length && isMonacoEditorEnabled ) {
					mediaInsertButtons.forEach( ( button ) => {
						button.removeEventListener( 'mouseup', syncTextareaToEditor );
						button.addEventListener( 'mouseup', syncTextareaToEditor );
						button.removeEventListener( 'keydown', syncTextareaToEditor );
						button.addEventListener( 'keydown', syncTextareaToEditor );
					} );
				}
			} ).observe( document.documentElement, {
				childList: true,
				subtree: true,
			} );
		}
	};

	// Switch to visual edit mode.
	const toVisual = () => {
		if ( isMonacoEditorEnabled ) {
			monaco.editor.getModels().forEach( ( model ) => model.dispose() );
			document.getElementById( 'monaco-editor-container' ).remove();
			tabHtml.onclick = toHtml;
			syncTriggers.forEach( ( button ) => {
				button.removeEventListener( 'mouseup', syncTextareaToEditor );
				button.removeEventListener( 'keydown', syncTextareaToEditor );
			} );
			window.removeEventListener( 'resize', onWindowResize );
			isMonacoEditorEnabled = false;
		}

		replaceIndentButton.style.display = 'none';
	};

	// Switch to html edit mode.
	const toHtml = () => {
		if ( ! isMonacoEditorEnabled ) {
			setTimeout( () => {
				runEditor();
			}, 300 );
			tabTmce.onclick = toVisual;
		}

		setTimeout( () => {
			updateToolbarMargin();
		}, 300 );

		replaceIndentButton.style.display = 'inline-block';
	};

	// Initialize
	if ( ! isEditorEnabled ) {
		return;
	}

	runObserve();

	if ( ! isVisualEditorEnabled ) {
		runEditor();
		replaceIndentButton.style.display = 'inline-block';
	} else if ( isVisualEditMode ) {
		tabHtml.onclick = toHtml;
	} else {
		runEditor();
		replaceIndentButton.style.display = 'inline-block';
		tabTmce.onclick = toVisual;
	}
} );
