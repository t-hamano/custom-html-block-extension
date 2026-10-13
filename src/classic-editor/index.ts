/**
 * External dependencies
 */
import { emmetHTML } from 'emmet-monaco-es';
import type * as Monaco from 'monaco-editor';

/**
 * Internal dependencies
 */
import './style.scss';
import initLoader from '../lib/loader';
import { applyTheme, applyBracketPairColorization } from '../lib/editor';
import { loadWebFont } from '../lib/helper';
import addWrapWithAbbreviationAction, {
	isApplyingWrapPreview,
} from '../components/wrap-with-abbreviation';

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

		// Enable Emmet once, since the editor is recreated on every switch to the text mode.
		if ( window.chbeObj.editorSettings.emmet ) {
			emmetHTML( monaco, [ 'html', 'php' ] );
		}

		// Restore the cursor position and selection saved when the post was submitted,
		// since the page is reloaded after saving.
		const viewStateKey = `chbe-view-state-${
			( document.getElementById( 'post_ID' ) as HTMLInputElement | null )?.value ?? ''
		}`;
		let savedViewState: Monaco.editor.ICodeEditorViewState | null = null;
		try {
			const storedViewState = window.sessionStorage.getItem( viewStateKey );
			window.sessionStorage.removeItem( viewStateKey );
			savedViewState = storedViewState ? JSON.parse( storedViewState ) : null;
		} catch {}

		document.getElementById( 'post' )?.addEventListener( 'submit', () => {
			// Ignore the submission for previewing, which doesn't reload the page.
			const previewInput = document.getElementById( 'wp-preview' ) as HTMLInputElement | null;
			if ( ! isMonacoEditorEnabled || ! window.editor || 'dopreview' === previewInput?.value ) {
				return;
			}
			try {
				window.sessionStorage.setItem(
					viewStateKey,
					JSON.stringify( window.editor.saveViewState() )
				);
			} catch {}
		} );

		// Setting up the monaco editor.
		const runEditor = () => {
			const { editorSettings, editorOptions, fontFamily } = window.chbeObj;
			const { theme, tabSize, insertSpaces, detectIndentation, emmet } = editorSettings;

			// Generate an element to apply the monaco editor.
			const monacoEditorContainer = document.createElement( 'div' );
			monacoEditorContainer.classList.add( 'chbe-monaco-editor' );
			editorContainer.appendChild( monacoEditorContainer );

			// Monaco editor properties.
			const properties = {
				theme,
				value: textarea.value,
				language: 'html',
				automaticLayout: true,
				...editorOptions,
				tabSize,
				insertSpaces,
				detectIndentation,
				// Override some properties to match the classic editor.
				scrollBeyondLastLine: false,
				scrollbar: {
					...editorOptions.scrollbar,
					vertical: 'hidden',
					alwaysConsumeMouseWheel: false,
				},
				// Monaco's HTML outline is flat, so the default `outlineModel` pins no lines in sticky scroll.
				stickyScroll: {
					...editorOptions.stickyScroll,
					defaultModel: 'foldingProviderModel',
				},
			};

			// Create monaco editor.
			const editor = monaco.editor.create(
				monacoEditorContainer,
				properties as Monaco.editor.IStandaloneEditorConstructionOptions
			);
			window.editor = editor;

			// Apply the bracket pair colorization and theme from the editor settings.
			applyBracketPairColorization( editor.getModel(), editorOptions.bracketPairColorization );
			applyTheme( monaco, theme );

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

			if ( emmet ) {
				addWrapWithAbbreviationAction( monaco, editor );
			}

			// Change editor area height.
			const contentHeight = Math.max( 300, editor.getContentHeight() );
			monacoEditorContainer.style.height = `${ contentHeight }px`;

			if ( savedViewState ) {
				editor.restoreViewState( savedViewState );
				savedViewState = null;
				editor.focus();

				// The page scrolls instead of the editor, so scroll the page to the cursor.
				const position = editor.getPosition();
				const visiblePosition = position && editor.getScrolledVisiblePosition( position );
				if ( visiblePosition ) {
					window.scrollTo( {
						top:
							window.scrollY +
							monacoEditorContainer.getBoundingClientRect().top +
							visiblePosition.top -
							window.innerHeight / 2,
					} );
				}
			}

			// Event emitted when the contents of the editor have changed.
			editor.getModel()?.onDidChangeContent( () => {
				// Change editor area height.
				const newContentHeight = Math.max( 300, editor.getContentHeight() );
				monacoEditorContainer.style.height = `${ newContentHeight }px`;

				// Apply changes in the editor to the original textarea, except for the preview
				// of "Wrap with Abbreviation" until it's confirmed.
				const editorValue = editor.getModel()?.getValue();
				if (
					isApplyingWrapPreview( editor ) ||
					editorValue === undefined ||
					textarea.value === editorValue
				) {
					return;
				}
				textarea.value = editorValue;
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
				loadWebFont( font, document, editorOptions.fontWeight ).then( ( isSuccess ) => {
					if ( isSuccess ) {
						monaco.editor.remeasureFonts();
					}
				} );
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
			const monacoEditor = document.querySelector< HTMLElement >( '.chbe-monaco-editor' );
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
				// The preview of "Wrap with Abbreviation" differs from the textarea until it's confirmed.
				if ( ! isApplyingWrapPreview( editor ) && model.getValue() !== textarea.value ) {
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
		};

		// Switch to visual edit mode.
		const toVisual = () => {
			if ( isMonacoEditorEnabled ) {
				monaco.editor.getModels().forEach( ( model ) => model.dispose() );
				document.querySelector( '.chbe-monaco-editor' )?.remove();
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
