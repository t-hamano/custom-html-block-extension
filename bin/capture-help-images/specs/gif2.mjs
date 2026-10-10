// GIFs operated by keyboard: caret, brackets, paste, tab stops.
/**
 * Internal dependencies
 */
import { timeline, focus, press } from './gif1.mjs';
import { PREVIEW } from './common.mjs';

const specs = [];
const keys =
	( key, n = 1 ) =>
	async ( page ) => {
		for ( let i = 0; i < n; i++ ) {
			await page.keyboard.press( key );
		}
	};

// cursorBlinking: the caret on the empty line 2.
[ 'blink', 'smooth', 'phase', 'expand' ].forEach( ( cursorBlinking, i ) => {
	const rel = `editor-options/cursor-blinking_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { cursorBlinking },
		value: '<p class="text">\n',
		anchor: { line: 2, column: 1, ax: 47, ay: 20 },
		setup: ( ctx ) => focus( 2, 1 )( ctx.page ),
		steps: () => timeline( rel, {} ),
	} );
} );

// cursorSmoothCaretAnimation: the caret jumps along line 2 and back.
const SMOOTH = '<p>Lorel ipsum</p>\n' + ' '.repeat( 16 ) + '\n';
specs.push( {
	rel: 'editor-options/cursor-smooth-caret-animation_1.gif',
	options: { cursorSmoothCaretAnimation: 'on' },
	value: SMOOTH,
	anchor: { line: 1, column: 1, ax: 79, ay: -1 },
	steps: () =>
		timeline( 'editor-options/cursor-smooth-caret-animation_1.gif', {
			0: focus( 1, 19 ),
			4: focus( 2, 1 ),
			8: focus( 2, 5 ),
			11: focus( 2, 9 ),
			14: focus( 2, 13 ),
			18: focus( 2, 17 ),
			21: focus( 2, 13 ),
			25: focus( 2, 9 ),
			28: focus( 2, 5 ),
			31: focus( 2, 1 ),
			34: focus( 1, 1 ),
			36: focus( 1, 19 ),
		} ),
} );
specs.push( {
	rel: 'editor-options/cursor-smooth-caret-animation_2.gif',
	options: { cursorSmoothCaretAnimation: 'off' },
	value: SMOOTH,
	anchor: { line: 1, column: 1, ax: 79, ay: -1 },
	steps: () =>
		timeline( 'editor-options/cursor-smooth-caret-animation_2.gif', {
			0: focus( 1, 19 ),
			3: focus( 2, 1 ),
			4: focus( 2, 5 ),
			5: focus( 2, 9 ),
			6: focus( 2, 13 ),
			7: focus( 2, 17 ),
			9: focus( 2, 13 ),
			10: focus( 2, 9 ),
			11: focus( 2, 5 ),
			12: focus( 2, 1 ),
			13: focus( 1, 19 ),
		} ),
} );

// matchBrackets: the caret moves around "<" of a tag.
[
	[ 'always', { 1: 2, 3: 3, 5: 2, 6: 3, 8: 2 } ],
	[ 'never', { 1: 2, 3: 3, 4: 2, 6: 3, 8: 2 } ],
	[ 'near', { 1: 2, 2: 3, 3: 1, 6: 2, 8: 3, 9: 1, 12: 2 } ],
].forEach( ( [ matchBrackets, cols ], i ) => {
	const rel = `editor-options/match-brackets_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { matchBrackets },
		value: '<this-is-tag>',
		anchor: { line: 1, column: 1, ax: 51, ay: 0 },
		steps: () =>
			timeline(
				rel,
				Object.fromEntries( Object.entries( cols ).map( ( [ f, c ] ) => [ f, focus( 1, c ) ] ) )
			),
	} );
} );

// formatOnPaste: select all, cut and paste unevenly indented lines.
const UNEVEN = [
	'<p>Lorem ipsum dolor sit amet</p>',
	'  <p>Lorem ipsum dolor sit amet</p>',
	'    <p>Lorem ipsum dolor sit amet</p>',
	'          <p>Lorem ipsum dolor sit amet</p>',
	'',
].join( '\n' );
[ true, false ].forEach( ( formatOnPaste, i ) => {
	const rel = `editor-options/format-on-paste_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { formatOnPaste },
		value: UNEVEN,
		anchor: { line: 1, column: 1, ax: 63, ay: -1 },
		steps: () =>
			timeline( rel, {
				1: focus( 5, 1 ),
				2: press( 'Control+A' ),
				4: press( 'Control+X' ),
				7: press( 'Control+V' ),
			} ),
	} );
} );

// stickyTabStops: extend the selection over the indentation of lines 6-7.
[
	[ true, { 1: focus( 6, 1 ), 3: 'R', 4: 'R', 5: 'R', 7: 'D', 9: 'L', 11: 'L', 13: 'L', 15: 'U' } ],
	[
		false,
		{
			1: focus( 6, 1 ),
			2: 'R',
			4: 'R',
			6: 'R',
			8: 'R',
			10: 'R',
			11: 'R',
			13: 'D',
			14: 'L',
			16: 'L',
			18: 'L',
			20: 'L',
			22: 'L',
			23: 'L',
			25: 'U',
		},
	],
].forEach( ( [ stickyTabStops, actions ], i ) => {
	const rel = `editor-options/sticky-tab-stops_${ i + 1 }.gif`;
	const KEY = {
		R: 'Shift+ArrowRight',
		L: 'Shift+ArrowLeft',
		D: 'Shift+ArrowDown',
		U: 'Shift+ArrowUp',
	};
	specs.push( {
		rel,
		options: { stickyTabStops },
		value: PREVIEW,
		// A tall editor cropped at line 5 instead of scrolling: Monaco re-centers
		// the cursor on the first key press after a programmatic scroll.
		anchor: { line: 5, column: 1, ax: 69, ay: 3.5 },
		steps: () =>
			timeline(
				rel,
				Object.fromEntries(
					Object.entries( actions ).map( ( [ f, a ] ) => [
						f,
						typeof a === 'string' ? press( KEY[ a ] ) : a,
					] )
				)
			),
	} );
} );

// useTabStops: Backspace in the indentation before <p> on line 3.
const TABS = [
	'<div class="box">',
	'  <div class="col">',
	'    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'  </div>',
	'</div>',
	'',
].join( '\n' );
[
	[ true, { 0: focus( 3, 5 ), 3: keys( 'Backspace' ), 6: keys( 'Backspace' ) } ],
	[
		false,
		{
			0: focus( 3, 5 ),
			3: keys( 'Backspace' ),
			5: keys( 'Backspace' ),
			6: keys( 'Backspace' ),
			8: keys( 'Backspace' ),
		},
	],
].forEach( ( [ useTabStops, actions ], i ) => {
	const rel = `editor-options/use-tab-stops_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { useTabStops },
		value: TABS,
		anchor: { line: 1, column: 1, ax: 47, ay: -3 },
		steps: () => timeline( rel, actions ),
	} );
} );

export default specs;
