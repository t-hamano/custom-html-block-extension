// Static images: control characters, final newline, indent guides, line highlight, whitespace, rounded selection.
/**
 * Internal dependencies
 */
import { CONSOLAS, arrows, focusAt, longDoc, scrollToLine } from './common.mjs';

const specs = [];
const pair = ( name, values ) =>
	values.map( ( v, i ) => [ `editor-options/${ name }_${ i + 1 }.jpg`, v ] );

// renderControlCharacters: SOH, STX and ETX at the end of the lines.
for ( const [ rel, renderControlCharacters ] of pair( 'render-control-characters', [
	true,
	false,
] ) ) {
	specs.push( {
		rel,
		options: { renderControlCharacters },
		value: 'Start of Heading\u0001\nStart of Text\u0002\nEnd of Text \u0003',
		caret: false,
		anchor: { line: 1, column: 1, ax: 54, ay: -1 },
	} );
}

// renderFinalNewline: the number of the empty last line, the caret on it.
const FINAL = [
	'<h1 class="title">This is title.</h1>',
	'<p class="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'',
	'<a href="https://wordpress.org/" target="_blank">WordPress.org</a>',
	'',
].join( '\n' );
for ( const [ rel, renderFinalNewline ] of pair( 'render-final-newline', [ 'on', 'off' ] ) ) {
	specs.push( {
		rel,
		options: { renderFinalNewline, cursorBlinking: 'solid' },
		value: FINAL,
		orig: { x0: 64, y0: -2.5, ...CONSOLAS },
		anchor: { line: 1, column: 1, ax: 64, ay: -2.5 },
		setup: ( ctx ) => focusAt( ctx, 5, 1 ),
		annotations: arrows( rel, { fixedX: true } ),
	} );
}

// renderIndentGuides: lines 320-332, cursor on line 325.
for ( const [ rel, renderIndentGuides ] of pair( 'render-indent-guides', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { renderIndentGuides },
		value: longDoc(),
		caret: false,
		anchor: { line: 320, column: 1, ax: 54, ay: 1 },
		setup: async ( ctx ) => {
			await focusAt( ctx, 325, 1 );
			await scrollToLine( ctx, 320 );
		},
	} );
}

// renderLineHighlight (light theme): cursor on line 2.
const HIGHLIGHT = [
	'',
	'<h1 class="title">This is title.</h1>',
	'  <p>Lorem ipsum dolor sit amet</p>',
	'  <a href="https://wordpress.org/" target="_blank">WordPress.org</a>',
	'',
].join( '\n' );
for ( const [ rel, renderLineHighlight ] of pair( 'render-line-highlight', [
	'all',
	'line',
	'gutter',
	'none',
] ) ) {
	specs.push( {
		rel,
		theme: 'light',
		options: { renderLineHighlight },
		value: HIGHLIGHT,
		caret: false,
		anchor: { line: 2, column: 1, ax: 58, ay: 19.5 },
		// Inside the text, so that no bracket pair is highlighted.
		setup: ( ctx ) => focusAt( ctx, 2, 25 ),
	} );
}

// renderWhitespace (light theme): line 1 is selected.
const WHITESPACE = [
	'<p>This is selected text</p>',
	'<p>Single spaces between words</p>',
	'<p>Double  spaces  between  words</p>',
	'<p>TrailingWhiteSpace</p>          ',
].join( '\n' );
for ( const [ rel, renderWhitespace ] of pair( 'render-whitespace', [
	'all',
	'boundary',
	'selection',
	'trailing',
	'none',
] ) ) {
	specs.push( {
		rel,
		theme: 'light',
		options: { renderWhitespace },
		value: WHITESPACE,
		caret: false,
		anchor: { line: 1, column: 1, ax: 31, ay: 3 },
		setup: ( ctx ) =>
			ctx.editorEval( ( monaco, ed ) => {
				ed.focus();
				ed.setSelection( new monaco.Selection( 1, 4, 1, 25 ) );
			} ),
	} );
}

// roundedSelection: "Lorem" selected.
for ( const [ rel, roundedSelection ] of pair( 'rounded-selection', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { roundedSelection },
		value: '<p> Lorem ipsum dolor sit amet</p>',
		caret: false,
		anchor: { line: 1, column: 1, ax: 12, ay: 12 },
		setup: ( ctx ) =>
			ctx.editorEval( ( monaco, ed ) => {
				ed.focus();
				ed.setSelection( new monaco.Selection( 1, 5, 1, 10 ) );
			} ),
	} );
}

export default specs;
