/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * Convert a selection in the editor into offsets in the textarea. Lines are joined with `\n`,
 * as in the value of a textarea.
 *
 * @param lines     The lines of the content.
 * @param selection The selection in the editor.
 */
export function getTextareaSelection( lines: string[], selection: Monaco.IRange ) {
	const getOffset = ( lineNumber: number, column: number ) =>
		lines.slice( 0, lineNumber - 1 ).reduce( ( offset, line ) => offset + line.length + 1, 0 ) +
		column -
		1;

	return {
		start: getOffset( selection.startLineNumber, selection.startColumn ),
		end: getOffset( selection.endLineNumber, selection.endColumn ),
	};
}

/**
 * Convert an offset in the textarea into a position in the editor. Lines are joined with `\n`,
 * as in the value of a textarea. An offset beyond the end is clamped to the end.
 *
 * @param lines  The lines of the content.
 * @param offset The offset in the textarea.
 */
export function getEditorPosition( lines: string[], offset: number ): Monaco.IPosition {
	let rest = Math.max( 0, offset );

	for ( let i = 0; i < lines.length; i++ ) {
		if ( rest <= lines[ i ].length ) {
			return { lineNumber: i + 1, column: rest + 1 };
		}
		// Skip the line and its line break.
		rest -= lines[ i ].length + 1;
	}

	const lastLine = lines[ lines.length - 1 ] ?? '';
	return { lineNumber: Math.max( 1, lines.length ), column: lastLine.length + 1 };
}
