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
 * Internal dependencies
 */
import loader from 'lib/loader';
import themes from 'lib/themes';

/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { useResizeObserver } from '@wordpress/compose';

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

const MonacoEditor = ( {
	className,
	language = 'html',
	loading = '',
	theme = 'vs-dark',
	options = {},
	value = '',
	useEmmet = true,
	tabSize,
	insertSpaces,
	onChange,
	onFontLoaded,
} ) => {
	const containerRef = useRef( null );
	const monacoRef = useRef( null );
	const editorRef = useRef( null );
	const subscriptionRef = useRef( null );

	const [ isEditorReady, setIsEditorReady ] = useState( false );
	const [ isMonacoMounting, setIsMonacoMounting ] = useState( true );
	const [ isLoadingFont, setIsLoadingFont ] = useState( false );

	const [ resizeListener, size ] = useResizeObserver();

	// Init loader and add cancel to promise.
	useEffect( () => {
		const { defaultView } = containerRef.current.ownerDocument;
		const cancelable = loader.init( defaultView );

		cancelable
			.then( ( monaco ) => ( monacoRef.current = monaco ) && setIsMonacoMounting( false ) )
			.catch(
				( error ) =>
					// eslint-disable-next-line no-console
					error?.type !== 'cancelation' && console.error( 'Monaco initialization: error:', error )
			);

		return () => ( editorRef.current ? disposeEditor() : cancelable.cancel() );
	}, [] );

	// Create monaco editor.
	useEffect( () => {
		if ( ! isMonacoMounting && ! isEditorReady ) {
			const { defaultView } = containerRef.current.ownerDocument;

			editorRef.current = monacoRef.current.editor.create( containerRef.current, {
				...options,
			} );

			// Apply language.
			monacoRef.current.editor.setModelLanguage( editorRef.current.getModel(), language );

			// Apply emmetHTML.
			if ( useEmmet && ! defaultView.enabledEmmet ) {
				defaultView.enabledEmmet = true;
				emmetHTML( monacoRef.current );
			}

			setIsEditorReady( true );
		}
	}, [ isMonacoMounting, isEditorReady ] );

	// Refresh layout.
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
		const font = chbeObj.fontFamily.find( ( data ) => fontFamily === data.name );

		if ( undefined !== font && 'label' in font ) {
			setIsLoadingFont( true );

			const webfontConfig = {
				timeout: 2000,
				custom: {
					families: [ font.name ],
				},
				active: () => {
					// Adjust the position of the cursor and space.
					monacoRef.current.editor.remeasureFonts();

					setIsLoadingFont( false );
					onFontLoaded( {
						isSuccess: true,
						font,
					} );
				},
				inactive: () => {
					onFontLoaded( {
						isSuccess: false,
						font,
					} );
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
			{ ( ! isEditorReady || isLoadingFont ) && <div style={ loadingStyles }>{ loading }</div> }
			<div ref={ containerRef } className={ className } />
		</div>
	);
};

export default MonacoEditor;
