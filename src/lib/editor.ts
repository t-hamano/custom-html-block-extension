/**
 * Monaco editor setup shared by the block, classic, and theme/plugin editors.
 */

/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * Catch the Ctrl+X or Ctrl+C shortcut and execute the clipboard action. Without
 * a range selection, these shortcuts cut or copy the block, so execute the custom
 * action instead.
 *
 * @param editor The editor instance.
 * @param monaco The monaco instance.
 * @param action Clipboard action.
 */
export function addClipboardCommand(
	editor: Monaco.editor.IStandaloneCodeEditor,
	monaco: typeof Monaco,
	action: 'cut' | 'copy'
) {
	const keyCode = 'cut' === action ? monaco.KeyCode.KeyX : monaco.KeyCode.KeyC;
	const actionId =
		'cut' === action ? 'editor.action.clipboardCutAction' : 'editor.action.clipboardCopyAction';

	editor.addCommand(
		// eslint-disable-next-line no-bitwise
		monaco.KeyMod.CtrlCmd | keyCode,
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
					// Select the current line if there is no range selection and "Copy the current line without selection" is enabled.
					editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
				}
				editor.trigger( 'keyboard', actionId, null );
			} else if ( ! isEmptySelection ) {
				editor.trigger( 'keyboard', actionId, null );
			}
		}
	);
}
