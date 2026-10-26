/**
 * WordPress dependencies
 */
import { createPortal, useEffect, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import MonacoEditor, { type MonacoError } from '../components/monaco-editor';
import useEditorConfigProps from '../block-editor/use-editor-config-props';

// Class names of the core `TextEditor` and `PostTextEditor` components.
const TEXT_EDITOR_BODY_SELECTOR = '.editor-text-editor__body';

// Added to the text editor body to hide the core textarea and its label.
const ACTIVE_CLASS_NAME = 'chbe-has-text-editor';

// Same as the minimum height of the core textarea.
const MIN_HEIGHT = 200;

// Monaco version of `PostTextEditor` in `@wordpress/editor`.
function PostTextEditor( { onError }: { onError: ( error: MonacoError ) => void } ) {
	const { postContent, currentPostType, currentPostId } = useSelect( ( select ) => {
		const { getCurrentPostType, getCurrentPostId, getEditedPostContent } = select( editorStore );
		return {
			postContent: getEditedPostContent(),
			currentPostType: getCurrentPostType(),
			currentPostId: getCurrentPostId(),
		};
	}, [] );
	const { editEntityRecord } = useDispatch( coreStore );

	const editorConfigProps = useEditorConfigProps( ( editorOptions ) => ( {
		...editorOptions,
		// Like the core textarea, the editor resizes to fit its content and the page
		// scrolls instead of the editor.
		scrollBeyondLastLine: false,
		scrollbar: {
			...editorOptions.scrollbar,
			vertical: 'hidden',
			alwaysConsumeMouseWheel: false,
		},
	} ) );

	// Write the content the same way as the core `PostTextEditor`. When switching
	// back to the visual editor, the content is parsed into blocks.
	const onChange = ( content: string ) => {
		// The text editor is shown only while a post is being edited.
		if ( currentPostId === null ) {
			return;
		}
		editEntityRecord( 'postType', currentPostType, currentPostId, {
			content,
			blocks: undefined,
			selection: undefined,
		} );
	};

	return (
		<MonacoEditor
			language="html"
			{ ...editorConfigProps }
			value={ postContent }
			onChange={ onChange }
			autoHeight={ { min: MIN_HEIGHT, max: Infinity } }
			onError={ onError }
			// Keep the z-indexes inside the editor, such as the minimap, from stacking
			// above the sticky toolbar of the code editor.
			style={ { isolation: 'isolate' } }
		/>
	);
}

/**
 * Replace the textarea of the code editor in the post and site editors with
 * the Monaco editor.
 */
export default function TextEditor() {
	const isTextMode = useSelect(
		( select ) => select( editorStore ).getEditorMode() === 'text',
		[]
	);
	// Fall back to the core textarea if Monaco fails to load.
	const [ hasError, setHasError ] = useState( false );
	const isEnabled = isTextMode && ! hasError;
	const [ body, setBody ] = useState< HTMLElement | null >( null );

	// Wait for the core text editor to be mounted, since it may mount after
	// this component.
	useEffect( () => {
		if ( ! isEnabled ) {
			setBody( null );
			return;
		}

		const find = () => {
			const element = document.querySelector< HTMLElement >( TEXT_EDITOR_BODY_SELECTOR );
			setBody( element?.isConnected ? element : null );
		};
		find();

		const observer = new MutationObserver( find );
		observer.observe( document.body, { childList: true, subtree: true } );

		return () => observer.disconnect();
	}, [ isEnabled ] );

	useEffect( () => {
		if ( ! body ) {
			return;
		}
		body.classList.add( ACTIVE_CLASS_NAME );
		return () => body.classList.remove( ACTIVE_CLASS_NAME );
	}, [ body ] );

	if ( ! body ) {
		return null;
	}

	return createPortal(
		<PostTextEditor
			onError={ ( error ) => {
				if ( error.type === 'timeout' || error.type === 'scripterror' ) {
					setHasError( true );
				}
			} }
		/>,
		body
	);
}
