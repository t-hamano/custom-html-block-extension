// GIFs: clipboard, indent guides, find, multi cursors, focus highlight.
/**
 * Internal dependencies
 */
import { timeline, focus, select, type, press } from './gif1.mjs';
import { PREVIEW, FIRA, longDoc, mouseSteps, backdrop } from './common.mjs';

const specs = [];
const addCursor = ( line, column ) => ( page ) =>
	page.evaluate(
		( [ l, c ] ) => {
			const ed = window.monaco.editor.getEditors()[ 0 ];
			const sel = new window.monaco.Selection( l, c, l, c );
			ed.setSelections( [ ...ed.getSelections(), sel ] );
		},
		[ line, column ]
	);
const typeEach = ( frames, text ) =>
	Object.fromEntries( frames.map( ( f, i ) => [ f, type( text[ i ] ) ] ) );

// emptySelectionClipboard: cut and paste the current line without a selection.
specs.push( {
	rel: 'editor-options/empty-selection-clipboard.gif',
	value: '<h1 class="title">This is title.</h1>\n\n<p>Lorem ipsum dolor sit amet</p>\n',
	anchor: { line: 1, column: 1, ax: 42, ay: 0 },
	steps: () =>
		timeline( 'editor-options/empty-selection-clipboard.gif', {
			1: focus( 1, 1 ),
			4: press( 'Control+X' ),
			6: press( 'Control+V' ),
			8: focus( 3, 16 ),
			10: press( 'Control+C' ),
			11: focus( 4, 1 ),
			12: press( 'Control+V' ),
		} ),
} );

// highlightActiveIndentGuide: the cursor moves between lines 347 and 350. The editor
// is tall and cropped, so the cursor keeps away from the edges and nothing scrolls.
[ true, false ].forEach( ( highlightActiveIndentGuide, i ) => {
	const rel = `editor-options/highlight-active-indent-guide_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { highlightActiveIndentGuide },
		value: longDoc(),
		stage: { width: 400, height: 700 },
		anchor: { line: 345, column: 1, ax: 53, ay: 0 },
		setup: ( ctx ) =>
			ctx.editorEval( ( monaco, ed ) => ed.setScrollTop( ed.getTopForLineNumber( 335 ) ) ),
		steps: () =>
			timeline( rel, {
				1: focus( 347, 3 ),
				3: press( 'ArrowDown' ),
				4: press( 'ArrowDown' ),
				5: press( 'ArrowDown' ),
				7: press( 'ArrowUp' ),
				8: press( 'ArrowUp' ),
				9: press( 'ArrowUp' ),
			} ),
	} );
} );

// find.loop: Enter in the find widget cycles 1 -> 2 -> 3 -> 1.
const SEARCH = [
	'<p>Search Text1 Lorel Ipsum Lorel Ipsum</p>',
	'<p>Lorel Ipsum Search Text2 Lorel Ipsum</p>',
	'<p>Lorel Ipsum Lorel Ipsum Search Text3 Lorel Ipsum</p>',
	'',
].join( '\n' );
specs.push( {
	rel: 'editor-options/find/loop.gif',
	value: SEARCH,
	stage: { width: 520, height: 300 },
	anchor: { line: 1, column: 1, ax: 56, ay: 31 },
	setup: async ( ctx ) => {
		await focus( 1, 1 )( ctx.page );
		await ctx.editorEval( ( monaco, ed ) => ed.trigger( 'keyboard', 'actions.find', null ) );
		await ctx.page.waitForTimeout( 400 );
		await ctx.page.keyboard.type( 'Search Text' );
		await ctx.page.waitForTimeout( 400 );
		await ctx.editorEval( ( monaco, ed ) => ed.setScrollTop( 0 ) );
	},
	clip: async ( ctx, W, H ) => {
		const p = await ctx.pos( 1, 1 );
		return { x: Math.round( p.x - 56 ), y: ctx.EY, width: W, height: H };
	},
	steps: () =>
		timeline(
			'editor-options/find/loop.gif',
			Object.fromEntries( [ 3, 5, 7, 9, 11, 13 ].map( ( f ) => [ f, press( 'Enter' ) ] ) )
		),
} );

// find.seedSearchStringFromSelection: select "Search Text." and open the find widget.
const SEED = [
	'<div class="box">',
	'  <div class="col">',
	'    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'    <p>Search Text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'  </div>',
	'</div>',
].join( '\n' );
specs.push( {
	rel: 'editor-options/find/seed-search-string-from-selection.gif',
	value: SEED,
	anchor: { line: 1, column: 1, ax: 53, ay: 0 },
	steps: () =>
		timeline( 'editor-options/find/seed-search-string-from-selection.gif', {
			1: focus( 6, 7 ),
			2: focus( 4, 8 ),
			...Object.fromEntries(
				[ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ].map( ( f ) => [
					f,
					press( 'Shift+ArrowRight' ),
				] )
			),
			18: press( 'Control+F' ),
		} ),
} );

// columnSelection: drag down then right to make a column selection, delete, undo.
const COLUMN = [
	'    <div class="col">',
	'      <ul>',
	...Array( 4 ).fill( '        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>' ),
	'      </ul>',
	'    </div>',
].join( '\n' );
specs.push( {
	rel: 'editor-options/column-selection.gif',
	options: { columnSelection: true },
	value: COLUMN,
	anchor: { line: 2, column: 1, ax: 55, ay: 11 },
	steps: async ( ctx ) => {
		const at = async ( line, column ) => {
			const p = await ctx.pos( line, column );
			return { x: p.x + 1, y: p.y + p.height / 2 };
		};
		const track = ctx.track();
		const path = {
			6: [ 3, 19 ],
			7: [ 6, 19 ],
			8: [ 6, 19 ],
			9: [ 6, 20 ],
			10: [ 6, 21 ],
			11: [ 6, 22 ],
			12: [ 6, 23 ],
			13: [ 6, 24 ],
			14: [ 6, 24 ],
		};
		const steps = [];
		for ( let i = 0; i < track.length; i++ ) {
			const [ l, c ] = path[ Math.min( Math.max( i, 6 ), 14 ) ];
			steps.push( { dur: track[ i ].dur, ...( await at( l, c ) ), down: i >= 6 && i < 14 } );
		}
		steps[ 1 ].action = focus( 5, 20 );
		steps[ 2 ].action = focus( 3, 18 );
		steps[ 4 ].action = focus( 3, 19 );
		steps[ 16 ].action = press( 'Delete' );
		steps[ 20 ].action = press( 'Control+Z' );
		return steps;
	},
} );

// multiCursorModifier: add cursors with Alt+click, then type on all of them.
specs.push( {
	rel: 'editor-options/multi-cursor-modifier.gif',
	value: Array( 4 ).fill( '<p>Lorem ipsum dolor sit amet</p>' ).join( '\n' ) + '\n',
	anchor: { line: 1, column: 1, ax: 36, ay: -1 },
	steps: () =>
		timeline( 'editor-options/multi-cursor-modifier.gif', {
			1: focus( 1, 4 ),
			3: addCursor( 2, 10 ),
			5: addCursor( 3, 16 ),
			8: addCursor( 4, 22 ),
			...typeEach( [ 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23 ], 'insert text.' ),
		} ),
} );

// multiCursorPaste: copy three lines, then paste on three cursors.
const PASTE = [
	'<ul>',
	'  <li>Copy Text 1</li>',
	'  <li>Copy Text 2</li>',
	'  <li>Copy Text 3</li>',
	...Array( 6 ).fill( '  <li>Lorel ipsum</li>' ),
	'</ul>',
].join( '\n' );
[
	[ 'spread', [ 10, 11, 12, 13 ], 22, 30, 40, 47, 51 ],
	[ 'full', [ 7, 9, 11, 12 ], 19, 27, 34, 39, 43 ],
].forEach( ( [ multiCursorPaste, drag, copy, c1, c2, c3, paste ], i ) => {
	const rel = `editor-options/multi-cursor-paste_${ i + 1 }.gif`;
	const ends = [
		[ 4, 19 ],
		[ 3, 10 ],
		[ 2, 5 ],
		[ 2, 3 ],
	];
	specs.push( {
		rel,
		options: { multiCursorPaste },
		value: PASTE,
		anchor: { line: 1, column: 1, ax: 40, ay: 0 },
		steps: () =>
			timeline( rel, {
				...Object.fromEntries( drag.map( ( f, k ) => [ f, select( 4, 23, ...ends[ k ] ) ] ) ),
				[ copy ]: press( 'Control+C' ),
				[ c1 ]: focus( 6, 23 ),
				[ c2 ]: addCursor( 8, 23 ),
				[ c3 ]: addCursor( 10, 23 ),
				[ paste ]: press( 'Control+V' ),
			} ),
	} );
} );

// renderLineHighlightOnlyWhenFocus (light theme): click in and out of the editor.
[ true, false ].forEach( ( renderLineHighlightOnlyWhenFocus, i ) => {
	const rel = `editor-options/render-line-highlight-only-when-focus_${ i + 1 }.gif`;
	specs.push( {
		rel,
		theme: 'light',
		options: { renderLineHighlightOnlyWhenFocus },
		value: PREVIEW,
		cursor: true,
		allowOutside: true,
		stageX: 220,
		stage: { width: 280, height: 158 },
		orig: { x0: 69, y0: -8 * 21, ...FIRA },
		setup: async ( ctx ) => {
			await backdrop( ctx );
			await ctx.editorEval( ( monaco, ed ) => ed.setScrollTop( ed.getTopForLineNumber( 9 ) ) );
		},
		clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
		steps: ( ctx ) => mouseSteps( ctx, { map: ctx.map } ),
	} );
} );

export default specs;
