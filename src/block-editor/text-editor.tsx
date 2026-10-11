/**
 * WordPress dependencies
 */
import { createPortal, useEffect, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import MonacoEditor from '../components/monaco-editor';

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
function PostTextEditor() {
	const { editorSettings, editorOptions } = window.chbeObj;
	const { value, type, id } = useSelect( ( select ) => {
		const { getCurrentPostType, getCurrentPostId, getEditedPostContent } = select(
			'core/editor'
		) as EditorSelectors;
		return {
			value: getEditedPostContent(),
			type: getCurrentPostType(),
			id: getCurrentPostId(),
		};
	}, [] );
	const { editEntityRecord } = useDispatch( 'core' );

	// Write the content the same way as the core `PostTextEditor`. When switching
	// back to the visual editor, the content is parsed into blocks.
	const onChange = ( content: string ) => {
		editEntityRecord( 'postType', type, id, {
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
				options={ editorOptions }
				value={ value }
				useEmmet={ editorSettings.emmet }
				tabSize={ editorSettings.tabSize }
				insertSpaces={ editorSettings.insertSpaces }
				detectIndentation={ editorSettings.detectIndentation }
				onChange={ onChange }
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
		// The store isn't registered in editors without the code editor, e.g. the widgets editor.
		( select ) =>
			( select( 'core/editor' ) as EditorSelectors | undefined )?.getEditorMode?.() === 'text',
		[]
	);
	const body = useTextEditorBody( isTextMode );

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

	return createPortal( <PostTextEditor />, body );
}
