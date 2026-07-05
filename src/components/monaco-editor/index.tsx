/**
 * Custom monaco editor component which is a customized version of @monaco-editor/react.
 *
 * @see https://github.com/suren-atoyan/monaco-react
 */

/**
 * External dependencies
 */
import webfontloader from 'webfontloader';
import { emmetHTML } from 'emmet-monaco-es';
import type * as Monaco from 'monaco-editor';
import type { CSSProperties } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { useResizeObserver } from '@wordpress/compose';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import themes from '../../lib/themes';
import initLoader from '../../lib/loader';
import type { EditorOptions, FontLoadResult } from '../../types';

export type MonacoError = {
	type: 'cancelation' | 'timeout' | 'scripterror';
	msg: string;
};

export type MonacoEditorProps = {
	className?: string;
	language?: string;
	theme?: string;
	options?: Partial< EditorOptions >;
	value?: string;
	useEmmet?: boolean;
	tabSize?: number;
	insertSpaces?: boolean;
	onChange?: ( value: string, event?: unknown ) => void;
	onFontLoad?: ( result: FontLoadResult ) => void;
	onError?: ( error: MonacoError ) => void;
};

const wrapperStyles: CSSProperties = {
	position: 'relative',
	height: '100%',
};

const loadingStyles: CSSProperties = {
	display: 'flex',
	height: '100%',
	width: '100%',
	justifyContent: 'center',
	alignItems: 'center',
	position: 'absolute',
	zIndex: 1,
	top: 0,
	left: 0,
	background: 'rgba(0, 0, 0, 0.3)',
	fontSize: '20px',
	color: '#fff',
	fontWeight: 'normal',
};

export default function MonacoEditor( {
	className,
	language = 'html',
	theme = 'vs-dark',
	options = {},
	value = '',
	useEmmet = true,
	tabSize,
	insertSpaces,
	onChange = () => null,
	onFontLoad = () => null,
	onError = () => null,
}: MonacoEditorProps ) {
	const containerRef = useRef< HTMLDivElement >( null );
	const monacoRef = useRef< typeof Monaco | null >( null );
	const editorRef = useRef< Monaco.editor.IStandaloneCodeEditor | null >( null );
	const subscriptionRef = useRef< Monaco.IDisposable | null >( null );

	const [ isEditorReady, setIsEditorReady ] = useState( false );
	const [ isMonacoMounting, setIsMonacoMounting ] = useState( true );

	const onChangeRef = useRef( onChange );
	onChangeRef.current = onChange;

	const [ resizeListener, size ] = useResizeObserver();

	// Init loader.
	useEffect( () => {
		const defaultView = containerRef.current?.ownerDocument.defaultView;
		if ( ! defaultView ) {
			return;
		}
		const cancelable = initLoader( defaultView );

		cancelable
			.then( ( monaco ) => {
				if ( monaco ) {
					monacoRef.current = monaco;
					setIsMonacoMounting( false );
				}
			} )
			.catch( ( error ) => onError( error ) );

		// Wait for monaco instance is mounted.
		const interval = setInterval( () => {
			const { monaco } = defaultView;
			if ( monaco?.editor && isMonacoMounting && ! isEditorReady ) {
				monacoRef.current = monaco;
				clearInterval( interval );
				setIsMonacoMounting( false );
			}
		}, 500 );

		return () => {
			if ( editorRef.current ) {
				disposeEditor();
			} else {
				cancelable.cancel();
			}
			clearInterval( interval );
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	// Create monaco editor.
	useEffect( () => {
		if ( ! isMonacoMounting && ! isEditorReady ) {
			const container = containerRef.current;
			const monaco = monacoRef.current;
			if ( ! container || ! monaco ) {
				return;
			}
			const { defaultView } = container.ownerDocument;

			const editor = monaco.editor.create( container, {
				ariaLabel: sprintf(
					/* translators: %s: keyboard shortcut to toggle tab focus mode. */
					__(
						'Editor content. To change the Tab key behavior to move focus out of the editor, press %s.',
						'custom-html-block-extension'
					),
					isAppleOS() ? 'Ctrl+Shift+M' : 'Ctrl+M'
				),
				...options,
			} as Monaco.editor.IStandaloneEditorConstructionOptions );
			editorRef.current = editor;

			const model = editor.getModel();
			if ( model ) {
				monaco.editor.setModelLanguage( model, language );

				// Set the initial value via setValue, which clears the undo/redo stack.
				// This prevents undo right after load from wiping out the content.
				if ( value ) {
					model.setValue( value );
				}
			}

			// Apply emmet.
			if ( useEmmet && defaultView && ! defaultView.enabledEmmet ) {
				defaultView.enabledEmmet = true;
				emmetHTML( monaco );
			}

			// Ctrl+X shortcut without a range selection will cut the block,
			// so catch the command and execute custom action instead.
			editor.addCommand(
				// eslint-disable-next-line no-bitwise
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX,
				() => {
					const selection = editor.getSelection();
					const position = editor.getPosition();
					if ( ! selection || ! position ) {
						return;
					}
					const lineNumber = position.lineNumber;
					const isEmptySelection =
						selection.startLineNumber === selection.endLineNumber &&
						selection.startColumn === selection.endColumn;

					if ( window.chbeObj.editorOptions.emptySelectionClipboard ) {
						if ( isEmptySelection ) {
							// Select and cut the current line if there is no range selection and "Copy the current line without selection" is enabled.
							editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
						}
						editor.trigger( 'keyboard', 'editor.action.clipboardCutAction', null );
					} else if ( ! isEmptySelection ) {
						editor.trigger( 'keyboard', 'editor.action.clipboardCutAction', null );
					}
				}
			);

			// Ctrl+C shortcut without a range selection will copy the block,
			// so catch the command and execute custom action instead.
			editor.addCommand(
				// eslint-disable-next-line no-bitwise
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC,
				() => {
					const selection = editor.getSelection();
					const position = editor.getPosition();
					if ( ! selection || ! position ) {
						return;
					}
					const lineNumber = position.lineNumber;
					const isEmptySelection =
						selection.startLineNumber === selection.endLineNumber &&
						selection.startColumn === selection.endColumn;

					if ( window.chbeObj.editorOptions.emptySelectionClipboard ) {
						if ( isEmptySelection ) {
							// Select and copy the current line if there is no range selection and "Copy the current line without selection" is enabled.
							editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
						}
						editor.trigger( 'keyboard', 'editor.action.clipboardCopyAction', null );
					} else if ( ! isEmptySelection ) {
						editor.trigger( 'keyboard', 'editor.action.clipboardCopyAction', null );
					}
				}
			);

			// Subscribe to content changes once; the callback is read from a ref
			// so prop changes don't require re-subscribing.
			subscriptionRef.current = editor.onDidChangeModelContent( ( event ) => {
				onChangeRef.current?.( editor.getValue(), event );
			} );

			setIsEditorReady( true );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isMonacoMounting, isEditorReady ] );

	// Refresh layout on window resize.
	useEffect( () => {
		const { width, height } = size;
		if ( isEditorReady && width && height ) {
			editorRef.current?.layout();
		}
	}, [ size, isEditorReady ] );

	// Change options.
	useEffect( () => {
		if ( isEditorReady ) {
			editorRef.current?.updateOptions( options as Monaco.editor.IEditorOptions );
			setTimeout( () => {
				monacoRef.current?.editor.remeasureFonts();
			}, 300 );
		}
	}, [ options, isEditorReady ] );

	// Change theme.
	useEffect( () => {
		const monaco = monacoRef.current;
		if ( isEditorReady && monaco ) {
			if ( 'vs-dark' === theme || 'light' === theme ) {
				monaco.editor.setTheme( theme );
			} else {
				const targetTheme = themes.find( ( data ) => theme === data.value );
				if ( targetTheme ) {
					monaco.editor.defineTheme( targetTheme.value, targetTheme.data );
					monaco.editor.setTheme( targetTheme.value );
				}
			}
		}
	}, [ theme, isEditorReady ] );

	// Change web font.
	useEffect( () => {
		if ( isEditorReady ) {
			loadFont( options.fontFamily );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ options.fontFamily, isEditorReady ] );

	// Change tab size, insert spaces.
	useEffect( () => {
		if ( isEditorReady ) {
			editorRef.current?.getModel()?.updateOptions( {
				tabSize,
				insertSpaces,
			} );
		}
	}, [ tabSize, insertSpaces, isEditorReady ] );

	// Set value.
	useEffect( () => {
		const editor = editorRef.current;
		if ( isEditorReady && editor && value !== editor.getValue() ) {
			const model = editor.getModel();
			if ( model ) {
				editor.executeEdits( '', [
					{
						range: model.getFullModelRange(),
						text: value,
						forceMoveMarkers: true,
					},
				] );
				editor.pushUndoStop();
			}
		}
	}, [ value, isEditorReady ] );

	// Dispose editor.
	function disposeEditor() {
		subscriptionRef.current?.dispose();
		const editor = editorRef.current;
		if ( ! editor ) {
			return;
		}
		const model = editor.getModel();
		if ( model ) {
			try {
				model.dispose();
			} catch {
				// Firefox throws NS_ERROR_NOT_INITIALIZED when iframe/document
				// is torn down (e.g. switching to code editor mode).
			}
		}
		editor.dispose();
		editorRef.current = null;
	}

	// Load web font.
	function loadFont( fontFamily?: string ) {
		const container = containerRef.current;
		if ( ! container ) {
			return;
		}
		const { ownerDocument } = container;
		const { defaultView } = ownerDocument;
		const font = window.chbeObj.fontFamily.find( ( data ) => fontFamily === data.name );

		if ( undefined !== font && 'label' in font ) {
			const webfontConfig: WebFont.Config = {
				timeout: 5000,
				custom: {
					families: [ font.name ],
				},
				active: () => {
					monacoRef.current?.editor.remeasureFonts();
					onFontLoad( { isSuccess: true, font } );
				},
				inactive: () => {
					monacoRef.current?.editor.remeasureFonts();
					onFontLoad( { isSuccess: false, font } );
				},
				context: defaultView ?? undefined,
			};

			// Add stylesheet if it is not in current document.
			if ( 'stylesheet' in font && font.stylesheet ) {
				const link = ownerDocument.querySelector( `link[href="${ font.stylesheet }"]` );
				if ( ! link ) {
					webfontConfig.custom!.urls = [ font.stylesheet ];
				}
			}

			webfontloader.load( webfontConfig );
		}
	}

	return (
		<div style={ wrapperStyles }>
			{ resizeListener }
			{ ! isEditorReady && (
				<div style={ loadingStyles }>{ __( 'Loading…', 'custom-html-block-extension' ) }</div>
			) }
			<div ref={ containerRef } className={ className } id="monaco-editor" />
		</div>
	);
}
