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

/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { useResizeObserver } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import themes from '../lib/themes';
import initLoader from '../lib/loader';

const wrapperStyles = {
	position: 'relative',
	height: '100%',
};

const loadingStyles = {
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
	loading = '',
	theme = 'vs-dark',
	options = {},
	value = '',
	useEmmet = true,
	tabSize,
	insertSpaces,
	onChange = () => null,
	onFontLoad = () => null,
	onError = () => null,
} ) {
	const containerRef = useRef( null );
	const monacoRef = useRef( null );
	const editorRef = useRef( null );
	const subscriptionRef = useRef( null );

	const [ isEditorReady, setIsEditorReady ] = useState( false );
	const [ isMonacoMounting, setIsMonacoMounting ] = useState( true );

	const [ resizeListener, size ] = useResizeObserver();

	// Init loader.
	useEffect( () => {
		const { defaultView } = containerRef.current.ownerDocument;
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
			// eslint-disable-next-line no-unused-expressions
			editorRef.current ? disposeEditor() : cancelable.cancel();
			clearInterval( interval );
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	// Create monaco editor.
	useEffect( () => {
		if ( ! isMonacoMounting && ! isEditorReady ) {
			const { ownerDocument } = containerRef.current;
			const { defaultView } = ownerDocument;

			editorRef.current = monacoRef.current.editor.create( containerRef.current, options );
			monacoRef.current.editor.setModelLanguage( editorRef.current.getModel(), language );

			// Apply emmet.
			if ( useEmmet && ! defaultView.enabledEmmet ) {
				defaultView.enabledEmmet = true;
				emmetHTML( monacoRef.current );
			}

			// Ctrl+X shortcut without a range selection will cut the block,
			// so catch the command and execute custom action instead.
			editorRef.current.addCommand(
				// eslint-disable-next-line no-bitwise
				monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.KeyX,
				() => {
					const selection = editorRef.current.getSelection();
					const lineNumber = editorRef.current.getPosition().lineNumber;
					const isEmptySelection =
						selection.startLineNumber === selection.endLineNumber &&
						selection.startColumn === selection.endColumn;

					if ( window.chbeObj.editorOptions.emptySelectionClipboard ) {
						if ( isEmptySelection ) {
							// Select and cut the current line if there is no range selection and "Copy the current line without selection" is enabled.
							editorRef.current.setSelection(
								new monacoRef.current.Selection( lineNumber, 1, lineNumber + 1, 1 )
							);
							ownerDocument.execCommand( 'cut' );
						}
						ownerDocument.execCommand( 'cut' );
					} else if ( ! isEmptySelection ) {
						ownerDocument.execCommand( 'cut' );
					}
				}
			);

			// Ctrl+C shortcut without a range selection will copy the block,
			// so catch the command and execute custom action instead.
			editorRef.current.addCommand(
				// eslint-disable-next-line no-bitwise
				monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.KeyC,
				() => {
					const selection = editorRef.current.getSelection();
					const lineNumber = editorRef.current.getPosition().lineNumber;
					const isEmptySelection =
						selection.startLineNumber === selection.endLineNumber &&
						selection.startColumn === selection.endColumn;

					if ( window.chbeObj.editorOptions.emptySelectionClipboard ) {
						if ( isEmptySelection ) {
							// Select and cut the current line if there is no range selection and "Copy the current line without selection" is enabled.
							editorRef.current.setSelection(
								new monacoRef.current.Selection( lineNumber, 1, lineNumber + 1, 1 )
							);
							ownerDocument.execCommand( 'copy' );
						}
						ownerDocument.execCommand( 'copy' );
					} else if ( ! isEmptySelection ) {
						ownerDocument.execCommand( 'copy' );
					}
				}
			);

			setIsEditorReady( true );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isMonacoMounting, isEditorReady ] );

	// Refresh layout on window resize.
	useEffect( () => {
		const { width, height } = size;
		if ( isEditorReady && width && height ) {
			editorRef.current.layout();
		}
	}, [ size, isEditorReady ] );

	// Change options.
	useEffect( () => {
		if ( isEditorReady ) {
			editorRef.current.updateOptions( options );
			setTimeout( () => {
				monacoRef.current.editor.remeasureFonts();
			}, 300 );
		}
	}, [ options, isEditorReady ] );

	// Change theme.
	useEffect( () => {
		if ( isEditorReady ) {
			if ( 'vs-dark' === theme || 'light' === theme ) {
				monacoRef.current.editor.setTheme( theme );
			} else {
				const targetTheme = themes.find( ( data ) => theme === data.value );
				monacoRef.current.editor.defineTheme( targetTheme.value, targetTheme.data );
				monacoRef.current.editor.setTheme( targetTheme.value );
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
			editorRef.current.getModel().updateOptions( {
				tabSize,
				insertSpaces,
			} );
		}
	}, [ tabSize, insertSpaces, isEditorReady ] );

	// Set value.
	useEffect( () => {
		if ( isEditorReady && value !== editorRef.current.getValue() ) {
			editorRef.current.executeEdits( '', [
				{
					range: editorRef.current.getModel().getFullModelRange(),
					text: value,
					forceMoveMarkers: true,
				},
			] );
			editorRef.current.pushUndoStop();
		}
	}, [ value, isEditorReady ] );

	// Change value event.
	useEffect( () => {
		if ( isEditorReady && onChange ) {
			subscriptionRef.current?.dispose();
			subscriptionRef.current = editorRef.current?.onDidChangeModelContent( ( event ) => {
				onChange( editorRef.current.getValue(), event );
			} );
		}
	}, [ isEditorReady, onChange ] );

	// Dispose editor.
	function disposeEditor() {
		subscriptionRef.current?.dispose();
		editorRef.current.getModel()?.dispose();
		editorRef.current.dispose();
	}

	// Load web font.
	function loadFont( fontFamily ) {
		const { ownerDocument } = containerRef.current;
		const { defaultView } = ownerDocument;
		const font = window.chbeObj.fontFamily.find( ( data ) => fontFamily === data.name );

		if ( undefined !== font && 'label' in font ) {
			const webfontConfig = {
				timeout: 5000,
				custom: {
					families: [ font.name ],
				},
				active: () => {
					monacoRef.current.editor.remeasureFonts();
					onFontLoad( { isSuccess: true, font } );
				},
				inactive: () => {
					monacoRef.current.editor.remeasureFonts();
					onFontLoad( { isSuccess: false, font } );
				},
				context: defaultView,
			};

			// Add stylesheet if it is not in current document.
			if ( 'stylesheet' in font ) {
				const link = ownerDocument.querySelector( `link[href="${ font.stylesheet }"]` );
				if ( ! link ) {
					webfontConfig.custom.urls = [ font.stylesheet ];
				}
			}

			webfontloader.load( webfontConfig );
		}
	}

	return (
		<div style={ wrapperStyles }>
			{ resizeListener }
			{ ! isEditorReady && <div style={ loadingStyles }>{ loading }</div> }
			<div ref={ containerRef } className={ className } />
		</div>
	);
}
