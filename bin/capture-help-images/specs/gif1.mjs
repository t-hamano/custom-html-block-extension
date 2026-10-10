// GIFs operated by keyboard: auto closing, auto indent, auto surround.
/**
 * External dependencies
 */
import fs from 'node:fs';
/**
 * Internal dependencies
 */
import { TOOL } from '../lib/cap.mjs';

const specs = [];

// Steps with the original frame durations; `actions[i]` runs at frame i.
export function timeline( rel, actions ) {
	const track = JSON.parse(
		fs.readFileSync( `${ TOOL }/data/tracks/${ rel.replace( /\//g, '_' ) }.json`, 'utf8' )
	);
	return track.map( ( f, i ) => ( { dur: f.dur, action: actions[ i ] } ) );
}

export const focus = ( line, column ) => ( page ) =>
	page.evaluate(
		( [ l, c ] ) => {
			const ed = window.monaco.editor.getEditors()[ 0 ];
			ed.focus();
			ed.setPosition( { lineNumber: l, column: c } );
		},
		[ line, column ]
	);
export const select = ( l1, c1, l2, c2 ) => ( page ) =>
	page.evaluate(
		( a ) => {
			const ed = window.monaco.editor.getEditors()[ 0 ];
			ed.focus();
			ed.setSelection( new window.monaco.Selection( ...a ) );
		},
		[ l1, c1, l2, c2 ]
	);
export const type = ( text ) => ( page ) => page.keyboard.type( text );
export const press = ( key ) => ( page ) => page.keyboard.press( key );

// autoClosingBrackets / autoClosingQuotes: type "(" or '"' right after <p> on two lines.
const CLOSING = '<p>Lorem ipsum</p>\n<p>    Lorem ipsum</p>\n';
const closing = ( rel, options, ch, [ f1, f2, f3, f4 ] ) => ( {
	rel,
	options,
	value: CLOSING,
	anchor: { line: 1, column: 1, ax: 63, ay: -1 },
	steps: () =>
		timeline( rel, {
			[ f1 ]: focus( 1, 4 ),
			[ f2 ]: type( ch ),
			[ f3 ]: focus( 2, 4 ),
			[ f4 ]: type( ch ),
		} ),
} );
[ 'always', 'beforeWhitespace', 'never' ].forEach( ( v, i ) => {
	specs.push(
		closing(
			`editor-options/auto-closing-brackets_${ i + 1 }.gif`,
			{ autoClosingBrackets: v },
			'(',
			[ 1, 3, 5, 9 ]
		)
	);
} );
specs.push(
	closing(
		'editor-options/auto-closing-quotes_1.gif',
		{ autoClosingQuotes: 'always' },
		'"',
		[ 5, 7, 10, 13 ]
	)
);
specs.push(
	closing(
		'editor-options/auto-closing-quotes_2.gif',
		{ autoClosingQuotes: 'beforeWhitespace' },
		'"',
		[ 1, 4, 5, 8 ]
	)
);
specs.push(
	closing(
		'editor-options/auto-closing-quotes_3.gif',
		{ autoClosingQuotes: 'never' },
		'"',
		[ 4, 6, 8, 12 ]
	)
);

// autoIndent: Tab, "{" and Enter on an empty line.
[
	[ 'none', [ 2, 4, 6 ] ],
	[ 'keep', [ 3, 5, 7 ] ],
	[ 'advanced', [ 2, 4, 6 ] ],
].forEach( ( [ autoIndent, [ tab, brace, enter ] ], i ) => {
	const rel = `editor-options/auto-indent_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { autoIndent },
		value: '',
		anchor: { line: 1, column: 1, ax: 52, ay: 0 },
		steps: () =>
			timeline( rel, {
				0: focus( 1, 1 ),
				[ tab ]: press( 'Tab' ),
				[ brace ]: type( '{' ),
				[ enter ]: press( 'Enter' ),
			} ),
	} );
} );

// autoSurround: select a word and type '"' (line 1) or "(" (line 2).
const SURROUND = '<p>surround_with_quotes</p>\n<p>surround_with_brackets</p>\n';
[
	[ 'languageDefined', [ 2, 3, 5, 9, 10, 13 ] ],
	[ 'quotes', [ 2, 3, 6, 9, 10, 12 ] ],
	[ 'brackets', [ 2, 3, 6, 10, 12, 14 ] ],
	[ 'never', [ 2, 3, 6, 10, 12, 15 ] ],
].forEach( ( [ autoSurround, [ p1, s1, q, p2, s2, b ] ], i ) => {
	const rel = `editor-options/auto-surround_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { autoSurround },
		value: SURROUND,
		anchor: { line: 1, column: 1, ax: 34, ay: -1 },
		steps: () =>
			timeline( rel, {
				0: focus( 3, 1 ),
				[ p1 ]: focus( 1, 13 ),
				[ s1 ]: select( 1, 4, 1, 24 ),
				[ q ]: type( '"' ),
				[ p2 ]: focus( 2, 15 ),
				[ s2 ]: select( 2, 4, 2, 26 ),
				[ b ]: type( '(' ),
			} ),
	} );
} );

export default specs;
