// GIFs operated by keyboard: suggestions, line numbers, Emmet.
/**
 * Internal dependencies
 */
import { timeline, focus, type, press } from './gif1.mjs';
import { PREVIEW } from './common.mjs';

const specs = [];
// quickSuggestions: typing "<section class="" aria-hidden=""" with the suggest widget.
specs.push( {
	rel: 'editor-options/quick-suggestions.gif',
	value: '',
	anchor: { line: 1, column: 1, ax: 69, ay: 0 },
	steps: () =>
		timeline( 'editor-options/quick-suggestions.gif', {
			1: focus( 1, 1 ),
			2: type( '<' ),
			4: type( 's' ),
			5: type( 'e' ),
			6: type( 'c' ),
			7: press( 'Enter' ),
			9: type( ' c' ),
			10: type( 'l' ),
			11: press( 'Enter' ),
			13: press( 'End' ),
			14: type( ' a' ),
			15: type( 'r' ),
			16: type( 'i' ),
			17: type( 'a' ),
			18: type( '-' ),
			19: type( 'h' ),
			// The current list puts aria-haspopup first, so go two down and one up
			// to end on aria-hidden like the original.
			21: async ( page ) => {
				await page.keyboard.press( 'ArrowDown' );
				await page.keyboard.press( 'ArrowDown' );
			},
			22: press( 'ArrowUp' ),
			23: press( 'Enter' ),
		} ),
} );

// quickSuggestionsDelay: 10ms / 1000ms after typing "h".
[
	[
		10,
		{
			0: focus( 1, 4 ),
			4: type( 'h' ),
			6: press( 'Backspace' ),
			9: type( 'h' ),
			12: press( 'Backspace' ),
		},
	],
	[
		1000,
		{
			0: focus( 1, 4 ),
			3: type( 'h' ),
			8: press( 'Backspace' ),
			10: type( 'h' ),
			14: press( 'Backspace' ),
		},
	],
].forEach( ( [ quickSuggestionsDelay, actions ], i ) => {
	const rel = `editor-options/quick-suggestions-delay_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { quickSuggestionsDelay },
		value: '<a ',
		anchor: { line: 1, column: 1, ax: 51, ay: 0 },
		steps: () => timeline( rel, actions ),
	} );
} );

// lineNumbers: relative / interval while the cursor moves down.
[
	[ 'relative', [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] ],
	[ 'interval', [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 12 ] ],
].forEach( ( [ lineNumbers, downs ], i ) => {
	const rel = `editor-options/line-numbers_${ i + 3 }.gif`;
	specs.push( {
		rel,
		options: { lineNumbers },
		value: PREVIEW,
		anchor: { line: 1, column: 1, ax: 76, ay: -2.5 },
		steps: () =>
			timeline( rel, {
				0: focus( 1, 1 ),
				...Object.fromEntries( downs.map( ( f ) => [ f, press( 'ArrowDown' ) ] ) ),
			} ),
	} );
} );

// Emmet: type an abbreviation and expand it.
const EMMET = 'ul.list>li.item{text}*5';
specs.push( {
	rel: 'editor-settings/emmet.gif',
	value: '',
	anchor: { line: 1, column: 1, ax: 81, ay: 0 },
	steps: () =>
		timeline( 'editor-settings/emmet.gif', {
			1: focus( 1, 1 ),
			3: type( 'u' ),
			5: type( 'l' ),
			6: type( '.' ),
			7: type( 'l' ),
			8: type( 'i' ),
			9: type( 's' ),
			10: type( 't' ),
			11: type( '>' ),
			12: type( 'l' ),
			13: type( 'i' ),
			14: type( '.' ),
			15: type( 'i' ),
			16: type( 't' ),
			17: type( 'e' ),
			18: type( 'm' ),
			19: type( '{' ),
			20: type( 't' ),
			21: type( 'e' ),
			22: type( 'x' ),
			23: type( 't' ),
			24: type( '}' ),
			26: type( '*' ),
			27: type( '5' ),
			28: press( 'Enter' ),
		} ),
	note: EMMET,
} );

export default specs;
