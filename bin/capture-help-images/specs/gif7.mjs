// GIFs operated by mouse wheel, drag and clicks on scrollbars / minimap.
/**
 * Internal dependencies
 */
import { timeline, focus, press } from './gif1.mjs';
import {
	PREVIEW,
	SNIPPET,
	longDoc,
	mouseSteps,
	cropMap,
	backdrop,
	resize,
	rectOf,
	editorWidth,
} from './common.mjs';

const specs = [];
const PREVIEW_LINES = PREVIEW.trimEnd().split( '\n' );
const MANY = Array( 6 ).fill( PREVIEW.trimEnd() ).join( '\n' ) + '\n';
const wheel =
	( n, horizontal = false ) =>
	async ( page ) => {
		for ( let i = 0; i < Math.abs( n ); i++ ) {
			await page.mouse.wheel(
				horizontal ? Math.sign( n ) * 120 : 0,
				horizontal ? 0 : Math.sign( n ) * 120
			);
			await page.waitForTimeout( 15 );
		}
	};
// Steps with the mouse resting at (x, y) and wheel notches at given frames.
const wheelSteps = ( rel, at, notches, extra = {} ) =>
	timeline( rel, {
		...extra,
		...Object.fromEntries( Object.entries( notches ).map( ( [ f, n ] ) => [ f, wheel( n ) ] ) ),
	} ).map( ( s ) => ( { ...s, x: at.x, y: at.y } ) );
const layout = ( ctx ) => ctx.editorEval( ( monaco, ed ) => ed.getLayoutInfo() );

// scrollBeyondLastLine: wheel down to the end and back.
const BEYOND = [ ...PREVIEW_LINES, ...PREVIEW_LINES.slice( 0, 10 ) ].join( '\n' );
[
	[ true, { 1: 3, 2: 2, 3: 2, 4: 3, 5: 1, 6: -4, 7: -2, 8: -2, 9: -1, 10: -2 } ],
	[ false, { 1: 1, 2: 2, 3: 2, 4: -1, 5: -1, 6: -3 } ],
].forEach( ( [ scrollBeyondLastLine, notches ], i ) => {
	const rel = `editor-options/scroll-beyond-last-line_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { scrollBeyondLastLine },
		value: BEYOND,
		stage: { width: 400, height: 298 },
		clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
		steps: ( ctx ) => wheelSteps( rel, { x: ctx.EX + 230, y: ctx.EY + 150 }, notches ),
	} );
} );

// smoothScrolling: three notches down and up.
[
	[ true, { 3: 1, 8: 1, 12: 1, 17: -1, 21: -1, 25: -1 } ],
	[ false, { 3: 1, 4: 1, 5: 1, 6: -1, 7: -1, 8: -1 } ],
].forEach( ( [ smoothScrolling, notches ], i ) => {
	const rel = `editor-options/smooth-scrolling_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { smoothScrolling },
		value: BEYOND,
		stage: { width: 400, height: 260 },
		clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
		steps: ( ctx ) => wheelSteps( rel, { x: ctx.EX + 230, y: ctx.EY + 100 }, notches ),
	} );
} );

// mouseWheelZoom: Ctrl + wheel zooms in three steps and back.
specs.push( {
	rel: 'editor-options/mouse-wheel-zoom.gif',
	options: { mouseWheelZoom: true },
	value: PREVIEW,
	stage: { width: 400, height: 240 },
	clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
	steps: ( ctx ) =>
		wheelSteps(
			'editor-options/mouse-wheel-zoom.gif',
			{ x: ctx.EX + 231, y: ctx.EY + 107 },
			{
				1: -1,
				2: -1,
				3: -1,
				4: 1,
				5: 1,
				6: 1,
			}
		).map( ( s, i ) => ( { ...s, mods: i >= 1 && i <= 6 ? [ 'Control' ] : [] } ) ),
} );

// scrollBeyondLastColumn: drag the horizontal scrollbar from the end to the left and back.
const LONG_LINE = PREVIEW_LINES[ 6 ].trim();
[
	[
		0,
		[ 0, 0, -42, -110, -51, -59, -102, -50, -110, -51, 25, 110, 119, 110, 50, 60, 50, 26, 25, 0 ],
		2,
		18,
	],
	[
		20,
		[
			0, 0, -141, -142, -150, -106, -168, -79, -45, -44, -44, -18, -17, 97, 124, 150, 53, 44, 80,
			70, 97, 62, 106, 71, 0, 0,
		],
		2,
		22,
	],
].forEach( ( [ scrollBeyondLastColumn, shifts, downAt, upAt ], i ) => {
	const rel = `editor-options/scroll-beyond-last-column_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { scrollBeyondLastColumn },
		value: LONG_LINE,
		cursor: true,
		stage: { width: 400, height: 149 },
		setup: async ( ctx ) => {
			const l = await layout( ctx );
			await resize( ctx, { width: l.contentLeft + 280 } );
			// Scroll to the end of the line with the wheel.
			await ctx.page.mouse.move( ctx.EX + l.contentLeft + 100, ctx.EY + 50 );
			await wheel( 120, true )( ctx.page );
			await ctx.page.waitForTimeout( 300 );
		},
		clip: async ( ctx, W, H ) => {
			const l = await layout( ctx );
			return { x: ctx.EX + l.contentLeft, y: ctx.EY, width: W, height: H };
		},
		showScrollbars: true,
		steps: async ( ctx ) => {
			const slider = await rectOf( ctx, '.monaco-editor .scrollbar.horizontal .slider' );
			const track = await rectOf( ctx, '.monaco-editor .scrollbar.horizontal' );
			const { maxScroll } = await ctx.editorEval( ( monaco, ed ) => ( {
				maxScroll: ed.getScrollWidth() - ed.getLayoutInfo().contentWidth,
			} ) );
			const ratio = ( track.width - slider.width ) / maxScroll;
			const x0 = slider.x + slider.width / 2;
			const y0 = slider.y + slider.height / 2;
			let offset = 0;
			return timeline( rel, {} ).map( ( s, f ) => {
				offset += shifts[ f ] ?? 0;
				return {
					...s,
					x: x0 + offset * ratio,
					y: f < downAt ? y0 - 60 : y0,
					down: f >= downAt && f < upAt,
				};
			} );
		},
	} );
} );

// scrollbar.horizontal / vertical: auto, the scrollbar appears when the mouse is over the editor.
specs.push( {
	rel: 'editor-options/scrollbar/horizontal_1.gif',
	options: { scrollbar: { horizontal: 'auto' } },
	value: SNIPPET + '\n',
	cursor: true,
	allowOutside: true,
	stageX: 220,
	stage: { width: 500, height: 199 },
	setup: ( ctx ) => backdrop( ctx, '#fff' ),
	clip: async ( ctx, W, H ) => {
		const l = await layout( ctx );
		return { x: ctx.EX + l.contentLeft, y: ctx.EY, width: W, height: H };
	},
	steps: ( ctx ) => mouseSteps( ctx, { map: cropMap( ctx ), down: [] } ),
} );
specs.push( {
	rel: 'editor-options/scrollbar/vertical_1.gif',
	options: { scrollbar: { vertical: 'auto' } },
	value: SNIPPET + '\n',
	cursor: true,
	allowOutside: true,
	stageX: 220,
	stageY: 81,
	stage: { width: 400, height: 199 },
	setup: async ( ctx ) => {
		await backdrop( ctx, '#fff' );
		const p = await ctx.pos( 1, 12 );
		await resize( ctx, { width: Math.round( p.x - ctx.EX + 256 ) } );
	},
	clip: async ( ctx, W, H ) => ( {
		x: ctx.EX + ( await editorWidth( ctx ) ) - W,
		y: ctx.EY - 41,
		width: W,
		height: H,
	} ),
	steps: ( ctx ) => mouseSteps( ctx, { map: cropMap( ctx ), down: [] } ),
} );

// scrollbar.scrollByPage: clicks on the track below the slider.
specs.push( {
	rel: 'editor-options/scrollbar/scroll-by-page.gif',
	options: { scrollbar: { scrollByPage: true }, wordWrap: 'on' },
	value: longDoc(),
	cursor: true,
	showScrollbars: true,
	stage: { width: 320, height: 199 },
	clip: async ( ctx, W, H ) => ( { x: ctx.EX + 320 - W, y: ctx.EY, width: W, height: H } ),
	steps: ( ctx ) =>
		timeline( 'editor-options/scrollbar/scroll-by-page.gif', {} ).map( ( s, f ) => ( {
			...s,
			x: ctx.EX + 320 - 5,
			y: ctx.EY + 170,
			down: [ 3, 5, 9, 11, 13 ].includes( f ),
		} ) ),
} );

// scrollbar.alwaysConsumeMouseWheel: the editor in a scrollable page.
async function inScrollablePage(
	ctx,
	{ W = 329, H = 320, top = 62, editorW = 312, editorH = 200 } = {}
) {
	await ctx.page.evaluate(
		( { X, Y, W, H, top, editorW, editorH } ) => {
			const page = document.createElement( 'div' );
			page.id = '__page';
			Object.assign( page.style, {
				position: 'fixed',
				left: `${ X }px`,
				top: `${ Y }px`,
				width: `${ W }px`,
				height: `${ H }px`,
				overflowY: 'scroll',
				overflowX: 'hidden',
				background: '#f0f0f1',
				zIndex: '100001',
			} );
			const host = document.querySelector( '.chbe-admin-editor-config-editor-preview' );
			const spacer = document.createElement( 'div' );
			spacer.style.height = `${ top }px`;
			const after = document.createElement( 'div' );
			after.style.height = '900px';
			page.append( spacer, host, after );
			Object.assign( host.style, {
				position: 'relative',
				left: '0',
				top: '0',
				width: `${ editorW }px`,
				height: `${ editorH }px`,
			} );
			document.body.appendChild( page );
			window.monaco.editor.getEditors()[ 0 ].layout();
		},
		{ X: ctx.EX, Y: ctx.EY, W, H, top, editorW, editorH }
	);
	await ctx.page.waitForTimeout( 300 );
}
const CONSUME = [
	'<div class="container">',
	'  <h2 class="heading">This is heading.</h2>',
	'  <h3 class="subheading">This is subheading.</h3>',
	'  <div class="box">',
	'    <div class="col">',
	'      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'    </div>',
	'  </div>',
	'</div>',
].join( '\n' );
[
	[
		true,
		{
			5: 1,
			6: 1,
			7: 1,
			8: 1,
			9: 1,
			10: -1,
			11: -1,
			12: -1,
			13: -1,
			14: -1,
			15: 1,
			16: 1,
			17: 1,
			18: 1,
			19: 1,
			20: -1,
			21: -1,
			22: -1,
			23: -1,
		},
	],
	[
		false,
		{
			...Object.fromEntries( [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ].map( ( f ) => [ f, 1 ] ) ),
			...Object.fromEntries( [ 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 ].map( ( f ) => [ f, -1 ] ) ),
			...Object.fromEntries( [ 62, 63, 64, 65, 66, 67, 68, 69, 70, 71 ].map( ( f ) => [ f, 1 ] ) ),
		},
	],
].forEach( ( [ alwaysConsumeMouseWheel, notches ], i ) => {
	const rel = `editor-options/scrollbar/always-consume-mouse-wheel_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { scrollbar: { alwaysConsumeMouseWheel } },
		value: CONSUME,
		stageX: 220,
		allowOutside: true,
		recreate: true,
		setup: async ( ctx ) => {
			await backdrop( ctx );
			await inScrollablePage( ctx );
		},
		clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
		// Over the line numbers.
		steps: ( ctx ) => wheelSteps( rel, { x: ctx.EX + 20, y: ctx.EY + 160 }, notches ),
	} );
} );

// minimap.enabled: drag the minimap slider down and back up.
specs.push( {
	rel: 'editor-options/minimap/enabled.gif',
	value: MANY,
	cursor: true,
	stage: { width: 400, height: 244 },
	clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
	steps: async ( ctx ) => {
		const l = await layout( ctx );
		const mx = ctx.EX + l.minimap.minimapLeft + 20;
		return ctx.track().map( ( f, i ) => ( {
			dur: f.dur,
			x: i >= 1 && i <= 23 ? mx + ( f.x - 370 ) : ctx.EX + f.x,
			y: ctx.EY + Math.max( f.y, 3 ),
			down: i >= 1 && i <= 23,
		} ) );
	},
} );

// minimap.showSlider: mouseover, the slider shows while the mouse is over the minimap.
specs.push( {
	rel: 'editor-options/minimap/show-slider_2.gif',
	options: { minimap: { showSlider: 'mouseover' } },
	value: MANY,
	cursor: true,
	allowOutside: true,
	stageX: 220,
	setup: async ( ctx ) => {
		await backdrop( ctx );
		const p = await ctx.pos( 2, 28 );
		await resize( ctx, { width: Math.round( p.x - ctx.EX + 300 ) } );
	},
	clip: async ( ctx, W, H ) => ( {
		x: ctx.EX + ( await editorWidth( ctx ) ) - 300,
		y: ctx.EY,
		width: W,
		height: H,
	} ),
	steps: ( ctx ) => mouseSteps( ctx, { map: cropMap( ctx ), down: [] } ),
} );

// dragAndDrop: select ' class="description"' and drop it after "<p" on line 2.
specs.push( {
	rel: 'editor-options/drag-and-drop.gif',
	options: { dragAndDrop: true },
	value:
		'<p class="description">Lorem ipsum dolor sit amet</p>\n<p>Lorem ipsum dolor sit amet</p>\n',
	cursor: true,
	stage: { width: 600, height: 200 },
	anchor: { line: 1, column: 1, ax: 62, ay: 0 },
	steps: async ( ctx ) => {
		const at = async ( line, col ) => {
			const p = await ctx.pos( line, col );
			return { x: p.x, y: p.y + p.height / 2 };
		};
		const track = ctx.track();
		const c3 = await at( 1, 3 );
		const c23 = await at( 1, 23 );
		const cw = c23.x - c3.x;
		const l2 = await at( 2, 3 );
		const steps = [];
		for ( let i = 0; i < track.length; i++ ) {
			const f = track[ i ];
			let p;
			if ( i <= 1 ) {
				p = { x: c3.x - 30 + i * 20, y: c3.y + 8 };
			} else if ( i <= 25 ) {
				p = { x: c3.x + Math.min( 1, Math.max( 0, ( f.x - 78 ) / ( 257 - 78 ) ) ) * cw, y: c3.y };
			} else if ( i <= 33 ) {
				p = { x: c3.x + cw - ( ( i - 25 ) / 8 ) * ( cw / 2 ), y: c3.y };
			} else if ( i <= 44 ) {
				const t = ( i - 33 ) / 11;
				p = { x: c3.x + cw / 2 + ( l2.x - ( c3.x + cw / 2 ) ) * t, y: c3.y + ( l2.y - c3.y ) * t };
			} else {
				p = { x: l2.x + 6, y: l2.y + 10 };
			}
			steps.push( { dur: f.dur, ...p, down: ( i >= 2 && i <= 25 ) || ( i >= 33 && i <= 44 ) } );
		}
		return steps;
	},
} );

// cursorSurroundingLines: hold the down key, then the up key. Sticky scroll adds its
// own padding of 5 lines, so it's disabled here to show the option itself.
[
	[ 0, [ 3, 24 ], [ 27, 48 ] ],
	[ 5, [ 3, 23 ], [ 26, 47 ] ],
].forEach( ( [ cursorSurroundingLines, [ d0, d1 ], [ u0, u1 ] ], i ) => {
	const rel = `editor-options/cursor-surrounding-lines_${ i + 1 }.gif`;
	const actions = { 0: focus( 1, 1 ) };
	for ( let f = d0; f <= d1; f++ ) {
		actions[ f ] = press( 'ArrowDown' );
	}
	for ( let f = u0; f <= u1; f++ ) {
		actions[ f ] = press( 'ArrowUp' );
	}
	specs.push( {
		rel,
		options: { cursorSurroundingLines, stickyScroll: { enabled: false } },
		value: '\n'.repeat( 49 ),
		stage: { width: 240, height: 298 },
		clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
		steps: () => timeline( rel, actions ),
	} );
} );

// cursorSurroundingLinesStyle: clicks near the top and bottom edges.
[
	[ 'all', [ 7, 18, 26, 35 ] ],
	[ 'default', [ 3, 4, 10, 21, 28, 39 ] ],
].forEach( ( [ cursorSurroundingLinesStyle, clicks ], i ) => {
	const rel = `editor-options/cursor-surrounding-lines-style_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: {
			cursorSurroundingLines: 5,
			cursorSurroundingLinesStyle,
			stickyScroll: { enabled: false },
		},
		value: MANY,
		cursor: true,
		stage: { width: 240, height: 298 },
		setup: ( ctx ) =>
			ctx.editorEval( ( monaco, ed ) => ed.setScrollTop( ed.getTopForLineNumber( 29 ) ) ),
		clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
		steps: ( ctx ) => mouseSteps( ctx, { map: cropMap( ctx ), down: clicks } ),
	} );
} );

// Resting the mouse over code opens hovers, which the originals don't show.
specs.forEach( ( s ) => ( s.options = { hover: { enabled: 'off' }, ...s.options } ) );

export default specs;
