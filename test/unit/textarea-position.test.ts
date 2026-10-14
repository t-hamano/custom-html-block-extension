/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { getEditorPosition, getTextareaSelection } from '../../src/lib/textarea-position';

const range = (
	startLineNumber: number,
	startColumn: number,
	endLineNumber = startLineNumber,
	endColumn = startColumn
) => ( { startLineNumber, startColumn, endLineNumber, endColumn } );

describe( 'getTextareaSelection', () => {
	const value = 'abc\n\nde\nfghi';
	const lines = value.split( '\n' );

	it( 'converts a cursor on the first line', () => {
		expect( getTextareaSelection( lines, range( 1, 1 ) ) ).toEqual( { start: 0, end: 0 } );
		expect( getTextareaSelection( lines, range( 1, 4 ) ) ).toEqual( { start: 3, end: 3 } );
	} );

	it( 'converts a cursor on an empty line', () => {
		expect( getTextareaSelection( lines, range( 2, 1 ) ) ).toEqual( { start: 4, end: 4 } );
	} );

	it( 'converts a selection within a line', () => {
		expect( getTextareaSelection( lines, range( 4, 2, 4, 4 ) ) ).toEqual( { start: 9, end: 11 } );
		expect( value.slice( 9, 11 ) ).toBe( 'gh' );
	} );

	it( 'converts a multi-line selection', () => {
		const { start, end } = getTextareaSelection( lines, range( 1, 2, 3, 2 ) );
		expect( value.slice( start, end ) ).toBe( 'bc\n\nd' );
	} );

	it( 'converts a selection to the end of the content', () => {
		const { start, end } = getTextareaSelection( lines, range( 1, 1, 4, 5 ) );
		expect( { start, end } ).toEqual( { start: 0, end: value.length } );
	} );
} );

describe( 'getEditorPosition', () => {
	const value = 'abc\n\nde\nfghi';
	const lines = value.split( '\n' );

	it( 'converts offsets on each line', () => {
		expect( getEditorPosition( lines, 0 ) ).toEqual( { lineNumber: 1, column: 1 } );
		expect( getEditorPosition( lines, 4 ) ).toEqual( { lineNumber: 2, column: 1 } );
		expect( getEditorPosition( lines, 6 ) ).toEqual( { lineNumber: 3, column: 2 } );
		expect( getEditorPosition( lines, 10 ) ).toEqual( { lineNumber: 4, column: 3 } );
	} );

	it( 'converts an offset at the end of a line', () => {
		expect( getEditorPosition( lines, 3 ) ).toEqual( { lineNumber: 1, column: 4 } );
		expect( getEditorPosition( lines, 7 ) ).toEqual( { lineNumber: 3, column: 3 } );
	} );

	it( 'converts an offset in a short line after several lines', () => {
		expect( getEditorPosition( 'a\nb\ncd\nxyz'.split( '\n' ), 5 ) ).toEqual( {
			lineNumber: 3,
			column: 2,
		} );
	} );

	it( 'converts an offset at the end of the content', () => {
		expect( getEditorPosition( lines, value.length ) ).toEqual( { lineNumber: 4, column: 5 } );
		expect( getEditorPosition( lines, value.length + 10 ) ).toEqual( {
			lineNumber: 4,
			column: 5,
		} );
	} );

	it( 'handles empty content', () => {
		expect( getEditorPosition( [ '' ], 0 ) ).toEqual( { lineNumber: 1, column: 1 } );
	} );

	it( 'is the inverse of getTextareaSelection', () => {
		for ( let offset = 0; offset <= value.length; offset++ ) {
			const { lineNumber, column } = getEditorPosition( lines, offset );
			expect( getTextareaSelection( lines, range( lineNumber, column ) ).start ).toBe( offset );
		}
	} );
} );
