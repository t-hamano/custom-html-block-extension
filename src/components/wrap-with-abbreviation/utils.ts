/**
 * External dependencies
 */
import { expandAbbreviation } from 'emmet-monaco-es';
import type * as Monaco from 'monaco-editor';

/**
 * Get a private use character that doesn't appear in the text.
 *
 * @param lines The text lines.
 * @return The placeholder character.
 */
function getPlaceholder( lines: string[] ): string {
	const text = lines.join( '\n' );
	let code = 0xe000;
	while ( text.includes( String.fromCharCode( code ) ) ) {
		code++;
	}
	return String.fromCharCode( code );
}

export type WrapTarget = {
	range: Monaco.IRange;
	lines: string[];
	baseIndent: string;
};

/**
 * Get the ranges to wrap and their text for each selection.
 *
 * An empty selection targets the current line, and a multi-line selection
 * is trimmed and dedented so that the wrapped text keeps its relative indentation.
 *
 * @param model      The text model.
 * @param selections The editor selections.
 * @return The wrap targets sorted by position.
 */
export function getWrapTargets(
	model: Monaco.editor.ITextModel,
	selections: Monaco.Selection[]
): WrapTarget[] {
	const targets = [ ...selections ]
		.sort( ( a, b ) =>
			a.startLineNumber === b.startLineNumber
				? a.startColumn - b.startColumn
				: a.startLineNumber - b.startLineNumber
		)
		.map( ( selection ) => {
			let { startLineNumber, startColumn, endLineNumber, endColumn } = selection;

			if ( selection.isEmpty() ) {
				// Wrap the current line, or insert an empty element after the indentation
				// if the line has only whitespace.
				endColumn = model.getLineMaxColumn( endLineNumber );
				startColumn = model.getLineFirstNonWhitespaceColumn( startLineNumber ) ? 1 : endColumn;
			}

			// Exclude the trailing line break, e.g. when the whole lines are selected.
			if ( endLineNumber > startLineNumber && 1 === endColumn ) {
				endLineNumber--;
				endColumn = model.getLineMaxColumn( endLineNumber );
			}

			// Exclude the leading and trailing whitespace, unless only whitespace is selected.
			const firstColumn = model.getLineFirstNonWhitespaceColumn( startLineNumber );
			const lastColumn = model.getLineLastNonWhitespaceColumn( endLineNumber );
			const trimmedStartColumn =
				firstColumn && startColumn < firstColumn ? firstColumn : startColumn;
			const trimmedEndColumn = lastColumn && endColumn > lastColumn ? lastColumn : endColumn;
			if ( startLineNumber < endLineNumber || trimmedStartColumn < trimmedEndColumn ) {
				startColumn = trimmedStartColumn;
				endColumn = trimmedEndColumn;
			}

			const range = { startLineNumber, startColumn, endLineNumber, endColumn };
			const lineContent = model.getLineContent( startLineNumber );
			const baseIndent = lineContent.slice( 0, lineContent.search( /\S|$/ ) );

			return {
				range,
				lines: dedent( model.getValueInRange( range ).split( /\r?\n/ ), baseIndent ),
				baseIndent,
			};
		} );

	// Skip the targets overlapping the previous one, e.g. multiple empty selections on the same line.
	const result: WrapTarget[] = [];
	for ( const target of targets ) {
		const previous = result[ result.length - 1 ]?.range;
		const { range } = target;
		if (
			! previous ||
			range.startLineNumber > previous.endLineNumber ||
			( range.startLineNumber === previous.endLineNumber &&
				range.startColumn >= previous.endColumn &&
				// Empty ranges at the same position, e.g. multiple cursors on a whitespace-only line.
				! (
					range.startColumn === previous.startColumn &&
					range.startLineNumber === previous.startLineNumber
				) )
		) {
			result.push( target );
		}
	}
	return result;
}

/**
 * Remove the common indentation from the second and subsequent lines.
 *
 * @param lines      The lines to dedent.
 * @param baseIndent The indentation of the first line.
 * @return The dedented lines.
 */
function dedent( lines: string[], baseIndent: string ): string[] {
	// Use the whitespace prefix shared by the lines including the first one, so that
	// deeper indentation and mixed tabs and spaces keep their relative indentation.
	const commonIndent = lines
		.slice( 1 )
		.filter( ( line ) => line.trim() )
		.map( ( line ) => line.slice( 0, line.search( /\S/ ) ) )
		.reduce( ( common, indent ) => {
			let length = 0;
			while ( length < common.length && common[ length ] === indent[ length ] ) {
				length++;
			}
			return common.slice( 0, length );
		}, baseIndent ).length;

	return lines.map( ( line, index ) => ( 0 === index ? line : line.slice( commonIndent ) ) );
}

/**
 * Wrap the target text with the Emmet abbreviation.
 *
 * @param abbreviation The Emmet abbreviation.
 * @param target       The wrap target.
 * @param indent       The indentation unit.
 * @return The wrapped text, or `null` if the abbreviation is invalid.
 */
export function wrapWithAbbreviation(
	abbreviation: string,
	target: WrapTarget,
	indent: string
): string | null {
	if ( ! abbreviation.trim() ) {
		return null;
	}

	try {
		// Emmet escapes "$" in the text as a snippet syntax, so replace it with a placeholder
		// character and restore it after the expansion.
		const dollarPlaceholder = getPlaceholder( [ ...target.lines, abbreviation ] );
		return expandAbbreviation( abbreviation, {
			type: 'markup',
			syntax: 'html',
			text: target.lines.map( ( line ) => line.replaceAll( '$', dollarPlaceholder ) ),
			options: {
				'output.field': ( _index: number, placeholder: string ) => placeholder,
				'output.indent': indent,
				'output.baseIndent': target.baseIndent,
			},
		} ).replaceAll( dollarPlaceholder, '$' );
	} catch {
		return null;
	}
}
