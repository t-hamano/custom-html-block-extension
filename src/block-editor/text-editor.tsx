/**
 * WordPress dependencies
 */
import { createPortal, useEffect, useMemo, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import MonacoEditor, { type MonacoError } from '../components/monaco-editor';

// Selectors of the `core/editor` store used here. `@wordpress/editor` isn't
// imported, so that the script doesn't depend on it.
type EditorSelectors = {
	getEditorMode: () => string;
	getCurrentPostType: () => string;
	getCurrentPostId: () => number | string;
	getEditedPostContent: () => string;
};

// Class names of the core `TextEditor` and `PostTextEditor` components.
const TEXT_EDITOR_BODY_SELECTOR = '.editor-text-editor__body';

// Added to the text editor body to hide the core textarea and its label.
const ACTIVE_CLASS_NAME = 'chbe-has-text-editor';

// Same as the minimum height of the core textarea.
const MIN_HEIGHT = 200;

/**
 * Wait for the core text editor to be mounted, since it may mount after this
 * component.
 *
 * @param isEnabled Whether to look for the element.
 */
function useTextEditorBody( isEnabled: boolean ) {
	const [ element, setElement ] = useState< HTMLElement | null >( null );

	useEffect( () => {
		if ( ! isEnabled ) {
			setElement( null );
			return;
		}

		const find = () => {
			const body = document.querySelector< HTMLElement >( TEXT_EDITOR_BODY_SELECTOR );
			setElement( body?.isConnected ? body : null );
		};
		find();

		const observer = new MutationObserver( find );
		observer.observe( document.body, { childList: true, subtree: true } );

		return () => observer.disconnect();
	}, [ isEnabled ] );

	return element;
}

// Monaco version of `PostTextEditor` in `@wordpress/editor`.
function PostTextEditor( { onError }: { onError: ( error: MonacoError ) => void } ) {
	const { editorSettings, editorOptions } = window.chbeObj;
	const { postContent, currentPostType, currentPostId } = useSelect( ( select ) => {
		const { getCurrentPostType, getCurrentPostId, getEditedPostContent } = select(
			'core/editor'
		) as EditorSelectors;
		return {
			postContent: getEditedPostContent(),
			currentPostType: getCurrentPostType(),
			currentPostId: getCurrentPostId(),
		};
	}, [] );
	const { editEntityRecord } = useDispatch( 'core' );

	// Like the core textarea, the editor resizes to fit its content and the page
	// scrolls instead of the editor.
	const options = useMemo(
		() => ( {
			...editorOptions,
			scrollBeyondLastLine: false,
			scrollbar: {
				...editorOptions.scrollbar,
				vertical: 'hidden' as const,
				alwaysConsumeMouseWheel: false,
			},
		} ),
		[ editorOptions ]
	);

	// Write the content the same way as the core `PostTextEditor`. When switching
	// back to the visual editor, the content is parsed into blocks.
	const onChange = ( content: string ) => {
		editEntityRecord( 'postType', currentPostType, currentPostId, {
			content,
			blocks: undefined,
			selection: undefined,
		} );
	};

	return (
		<div className="chbe-text-editor">
			<MonacoEditor
				language="html"
				theme={ editorSettings.theme }
				options={ options }
				value={ postContent }
				useEmmet={ editorSettings.emmet }
				tabSize={ editorSettings.tabSize }
				insertSpaces={ editorSettings.insertSpaces }
				detectIndentation={ editorSettings.detectIndentation }
				onChange={ onChange }
				autoHeight={ { min: MIN_HEIGHT, max: Infinity } }
				onError={ onError }
			/>
		</div>
	);
}

/**
 * Replace the textarea of the code editor in the post and site editors with
 * the Monaco editor.
 */
export default function TextEditor() {
	const isTextMode = useSelect(
		( select ) =>
			( select( 'core/editor' ) as EditorSelectors | undefined )?.getEditorMode?.() === 'text',
		[]
	);
	// Fall back to the core textarea if Monaco fails to load.
	const [ hasError, setHasError ] = useState( false );
	const body = useTextEditorBody( isTextMode && ! hasError );

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
