/**
 * External dependencies
 */
import webfontloader from 'webfontloader';
import { emmetHTML } from 'emmet-monaco-es';
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

		let isMonacoEditorEnabled = false;

		const textarea = document.getElementById( 'content' ) as HTMLTextAreaElement | null;
		const editorContainer = document.getElementById( 'wp-content-editor-container' );

		if ( ! textarea || ! editorContainer ) {
			return;
		}

		const tabTmce = document.getElementById( 'content-tmce' );
		const tabHtml = document.getElementById( 'content-html' );
		const draftButton = document.getElementById( 'save-post' );
		const publishButton = document.getElementById( 'publish' );
		const syncTriggers = document.querySelectorAll(
			'.ed_button, .ui-button, #wp-link-url, #wp-link-text, #wp-link-submit, #wp-link-search'
		);

		// Setting up the monaco editor.
		const runEditor = () => {
			const { editorSettings, editorOptions, fontFamily } = window.chbeObj;
			const { theme, tabSize, insertSpaces, emmet } = editorSettings;

			// Generate an element to apply the monaco editor.
			const monacoEditorContainer = document.createElement( 'div' );
			monacoEditorContainer.setAttribute( 'id', 'monaco-editor' );
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
			const editor = monaco.editor.create(
				monacoEditorContainer,
				properties as Monaco.editor.IStandaloneEditorConstructionOptions
			);
			window.editor = editor;

			// Force "preventScroll" on focus so clicking the editor doesn't scroll
			// the page back to the cursor (e.g. after browser find-in-page). Only
			// Chromium's EditContext element has this issue.
			// See https://github.com/microsoft/monaco-editor/issues/4248
			const focusTarget = monacoEditorContainer.querySelector(
				'.native-edit-context'
			) as HTMLElement | null;
			if ( focusTarget ) {
				const originalFocus = focusTarget.focus.bind( focusTarget );
				focusTarget.focus = ( options ) => originalFocus( { ...options, preventScroll: true } );
			}

			// Change editor area height.
			const contentHeight = Math.max( 300, editor.getContentHeight() );
			monacoEditorContainer.style.height = `${ contentHeight }px`;

			// Event emitted when the contents of the editor have changed.
			editor.getModel()?.onDidChangeContent( () => {
				// Apply changes in the editor to the original textarea.
				const editorValue = editor.getModel()?.getValue();
				if ( editorValue === undefined || textarea.value === editorValue ) {
					return;
				}
				textarea.value = editorValue;

				// Change editor area height.
				const newContentHeight = Math.max( 300, editor.getContentHeight() );
				monacoEditorContainer.style.height = `${ newContentHeight }px`;
			} );

			// Enable Emmet.
			if ( emmet ) {
				emmetHTML( monaco, [ 'html', 'php' ] );
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

			// Catch the Ctrl+S command to save draft or publish post.
			editor.addCommand(
				// eslint-disable-next-line no-bitwise
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
				() => {
					// eslint-disable-next-line no-unused-expressions
					draftButton ? draftButton.click() : publishButton?.click();
				}
			);

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
			const toolbar = document.getElementById( 'ed_toolbar' );
			if ( ! toolbar ) {
				return;
			}
			const toolbarPosition = window.getComputedStyle( toolbar ).position;
			const marginTop =
				'fixed' === toolbarPosition || 'absolute' === toolbarPosition
					? toolbar.clientHeight + 1
					: 0;
			const monacoEditor = document.getElementById( 'monaco-editor' );
			if ( monacoEditor ) {
				monacoEditor.style.marginTop = `${ marginTop }px`;
			}
		};

		// Window resize event.
		const onWindowResize = () => {
			setTimeout( () => {
				updateToolbarMargin();
			}, 300 );
		};

		// Apply changes in the original textarea to the editor.
		const syncTextareaToEditor = ( e: Event ) => {
			if ( ! isMonacoEditorEnabled ) {
				return;
			}

			// Do nothing if keycode is not "enter" ( Tab key to move focus, etc ).
			if ( 'keydown' === e.type && 'Enter' !== ( e as KeyboardEvent ).key ) {
				return;
			}

			const editor = window.editor;
			if ( ! editor ) {
				return;
			}

			// Apply selection to the original textarea.
			const model = editor.getModel();
			const selection = editor.getSelection();
			if ( ! model || ! selection ) {
				return;
			}
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
					editor.setPosition( {
						lineNumber: editorPosition.lineNumber,
						column: editorPosition.column,
					} );
					editor.focus();
				}
				checkCount++;
			}, 100 );
		};

		// Get cursor selection info for the original textarea.
		const getTextareaSelection = (
			model: Monaco.editor.ITextModel,
			selection: Monaco.Selection
		) => {
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
		const getEditorPosition = ( element: HTMLTextAreaElement ) => {
			const linesContent = element.value.split( '\n' );
			let selectionStart = element.selectionStart;
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
			const MutationObserverClass = window.MutationObserver || window.WebKitMutationObserver;
			if ( MutationObserverClass ) {
				new MutationObserverClass( () => {
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
				document.getElementById( 'monaco-editor' )?.remove();
				if ( tabHtml ) {
					tabHtml.onclick = toHtml;
				}
				syncTriggers.forEach( ( button ) => {
					button.removeEventListener( 'mouseup', syncTextareaToEditor );
					button.removeEventListener( 'keydown', syncTextareaToEditor );
				} );
				window.removeEventListener( 'resize', onWindowResize );
				isMonacoEditorEnabled = false;
			}
		};

		// Switch to html edit mode.
		const toHtml = () => {
			if ( ! isMonacoEditorEnabled ) {
				setTimeout( () => {
					runEditor();
				}, 300 );
				if ( tabTmce ) {
					tabTmce.onclick = toVisual;
				}
			}

			setTimeout( () => {
				updateToolbarMargin();
			}, 300 );
		};

		// Initialize
		runObserve();

		const wpContentWrap = document.getElementById( 'wp-content-wrap' );
		const isVisualEditorEnabled = wpContentWrap?.classList.contains( 'tmce-active' );

		if ( isVisualEditorEnabled ) {
			if ( tabHtml ) {
				tabHtml.onclick = toHtml;
			}
		} else {
			runEditor();
			if ( tabTmce ) {
				tabTmce.onclick = toVisual;
			}
		}
	} )
	.catch( ( error ) => {
		if ( error?.msg ) {
			// eslint-disable-next-line no-console
			console.error( error.msg );
		}
	} );
