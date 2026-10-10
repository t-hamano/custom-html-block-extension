// Helpers for capture specs: actions for GIF steps, and setup, crop and annotation helpers.
/**
 * Internal dependencies
 */
import { py, TOOL, IMG } from './cap.mjs';

// The default code of the settings screen preview, indented with 2 spaces.
export const PREVIEW_CODE = `<div class="container">
	<h2 class="title">Hello World</h2>
	<div class="row">
		<div class="col">
			<h3 class="subheading">Subtitle</h3>
			<img src="image.png" alt="WordPress" width="470" height="317">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
		<div class="col">
			<h3 class="subheading">Subtitle</h3>
			<img src="image.png" alt="WordPress" width="470" height="317">
			<a href="https://wordpress.org/" target="_blank">WordPress.org</a>
		</div>
	</div>
</div>
`.replace( /\t/g, '  ' );

// Actions: functions of `page`, used as the `action` of a GIF step or called in `setup`.

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

export const addCursor = ( line, column ) => ( page ) =>
	page.evaluate(
		( [ l, c ] ) => {
			const ed = window.monaco.editor.getEditors()[ 0 ];
			ed.setSelections( [ ...ed.getSelections(), new window.monaco.Selection( l, c, l, c ) ] );
		},
		[ line, column ]
	);

export const type = ( text ) => ( page ) => page.keyboard.type( text );

export const press = ( key ) => ( page ) => page.keyboard.press( key );

// Mouse wheel notches over the current mouse position. One notch scrolls 50px,
// like one notch of the original captures. Negative values scroll up / left.
export const wheel =
	( notches, horizontal = false ) =>
	async ( page ) => {
		const delta = Math.sign( notches ) * 120;
		for ( let i = 0; i < Math.abs( notches ); i++ ) {
			await page.mouse.wheel( horizontal ? delta : 0, horizontal ? 0 : delta );
			await page.waitForTimeout( 15 );
		}
	};

// Click at a position evaluated at the time of the click, e.g. `foldingControl`.
export const clickAt = ( where ) => async ( page ) => {
	const p = await where( page );
	await page.mouse.move( p.x, p.y );
	await page.mouse.down();
	await page.waitForTimeout( 60 );
	await page.mouse.up();
};

// Set the value of the control placed by `placeSettingControl` and apply
// `patch( value )` (editor options) to the editor.
export const setSettingValue = ( value, patch ) => async ( page ) => {
	await page.evaluate(
		( [ src, v ] ) => {
			const input = document.querySelector( '[data-capture="1"] input[type="number"]' );
			input.focus();
			Object.getOwnPropertyDescriptor( HTMLInputElement.prototype, 'value' ).set.call(
				input,
				String( v )
			);
			input.dispatchEvent( new Event( 'input', { bubbles: true } ) );
			const ed = window.monaco.editor.getEditors()[ 0 ];
			const options = new Function( 'v', `return (${ src })(v);` )( v );
			for ( const [ k, val ] of Object.entries( options ) ) {
				window.__pinnedOptions[ k ] =
					val && typeof val === 'object' && ! Array.isArray( val )
						? { ...window.__pinnedOptions[ k ], ...val }
						: val;
			}
			ed.__origUpdateOptions( window.__pinnedOptions );
		},
		[ patch.toString(), value ]
	);
};

// Page positions, evaluated when called (for `clickAt`).

export const foldingControl = ( line ) => ( page ) =>
	page.evaluate( ( l ) => {
		const ed = window.monaco.editor.getEditors()[ 0 ];
		const info = ed.getLayoutInfo();
		const rect = ed.getDomNode().getBoundingClientRect();
		const p = ed.getScrolledVisiblePosition( { lineNumber: l, column: 1 } );
		return {
			x: rect.left + info.decorationsLeft + info.decorationsWidth - 8,
			y: rect.top + p.top + p.height / 2,
		};
	}, line );

export const afterLineEnd =
	( line, gap = 30 ) =>
	( page ) =>
		page.evaluate(
			( [ l, g ] ) => {
				const ed = window.monaco.editor.getEditors()[ 0 ];
				const rect = ed.getDomNode().getBoundingClientRect();
				const p = ed.getScrolledVisiblePosition( {
					lineNumber: l,
					column: ed.getModel().getLineMaxColumn( l ),
				} );
				return { x: rect.left + p.left + g, y: rect.top + p.top + p.height / 2 };
			},
			[ line, gap ]
		);

// Steps

// Steps with the frame durations of the current GIF; `actions[ i ]` runs at frame i.
export function timeline( ctx, actions = {} ) {
	return ctx.track().map( ( f, i ) => ( { dur: f.dur, action: actions[ i ] } ) );
}

// Steps that replay the mouse path tracked in the current GIF. `map( x, y )`
// converts image coordinates to page coordinates. The button is down in the
// frames of `down`, or in the frames with a click mark when it's omitted.
export function mouseSteps( ctx, { map = ctx.map, down, actions = {}, overrides = {} } = {} ) {
	return ctx.track().map( ( f, i ) => {
		const p = map( f.x, f.y );
		return {
			dur: f.dur,
			x: p.x,
			y: p.y,
			down: down ? down.includes( i ) : Boolean( f.click ),
			action: actions[ i ],
			...( overrides[ i ] ?? {} ),
		};
	} );
}

// Steps from operations at times set directly, e.g. to keep GIFs shown side by
// side in step. Items (page coordinates):
//   { at: { x, y }, wait }          put the mouse there, then wait
//   { to: point | ( page ) => point, ms, axis: 'x' | 'y', wait }
//                                   glide there (axis: along x / y first), then wait
//   { click: true, wait }           click at the current position, then wait
//   { action, wait }                run an action, then wait
//   { wait }                        wait
// Glides are split into `frame` ms frames and waits into `holdFrame` ms frames.
export function plan( items, { frame = 50, holdFrame = 100 } = {} ) {
	const steps = [];
	let cur = null;
	// Long waits are split into short frames, so that changes during a wait
	// (e.g. a hover appearing) are captured. Identical frames are merged later.
	const hold = ( dur, first = {} ) => {
		let rest = dur;
		let props = first;
		do {
			const d = Math.min( rest, holdFrame );
			steps.push( { dur: d, ...props } );
			props = {};
			rest -= d;
		} while ( rest > 0 );
	};
	const ease = ( t ) => ( t < 0.5 ? 2 * t * t : 1 - ( -2 * t + 2 ) ** 2 / 2 );
	for ( const it of items ) {
		if ( it.at ) {
			cur = it.at;
			hold( it.wait ?? 100, { x: it.at.x, y: it.at.y } );
		} else if ( it.to ) {
			const ms = it.ms ?? 400;
			const n = Math.max( 1, Math.ceil( ms / frame ) );
			// One position per frame, set at the start of the frame, so that every
			// capture shows the same positions regardless of timing jitter.
			let path;
			const first = async ( page ) => {
				const target = typeof it.to === 'function' ? await it.to( page ) : it.to;
				const from = cur;
				let legs = [ target ];
				if ( it.axis === 'x' ) {
					legs = [ { x: target.x, y: from.y }, target ];
				} else if ( it.axis === 'y' ) {
					legs = [ { x: from.x, y: target.y }, target ];
				}
				const lens = [];
				let p = from;
				for ( const l of legs ) {
					lens.push( Math.hypot( l.x - p.x, l.y - p.y ) );
					p = l;
				}
				const total = lens.reduce( ( a, b ) => a + b, 0 ) || 1;
				// Each leg takes its share of the time and eases on its own.
				const at = ( r ) => {
					let q = from;
					let start = 0;
					for ( let i = 0; i < legs.length; i++ ) {
						const share = lens[ i ] / total;
						if ( r <= start + share || i === legs.length - 1 ) {
							const e = ease( Math.min( 1, ( r - start ) / ( share || 1 ) ) );
							return { x: q.x + ( legs[ i ].x - q.x ) * e, y: q.y + ( legs[ i ].y - q.y ) * e };
						}
						start += share;
						q = legs[ i ];
					}
					return target;
				};
				path = Array.from( { length: n }, ( _, k ) => at( ( k + 1 ) / n ) );
				cur = target;
				await page.mouse.move( path[ 0 ].x, path[ 0 ].y );
			};
			for ( let k = 0; k < n; k++ ) {
				steps.push( {
					dur: frame,
					action: k === 0 ? first : ( page ) => page.mouse.move( path[ k ].x, path[ k ].y ),
				} );
			}
			if ( it.wait ) {
				hold( it.wait );
			}
		} else if ( it.click ) {
			hold( it.wait ?? 300, {
				action: async ( page ) => {
					await page.mouse.down();
					await page.waitForTimeout( 80 );
					await page.mouse.up();
				},
			} );
		} else {
			hold( it.wait ?? 100, { action: it.action } );
		}
	}
	return steps;
}

// Image coordinates relative to the crop, shifted by (dx, dy).
export const cropMap =
	( ctx, dx = 0, dy = 0 ) =>
	( x, y ) => ( { x: ctx.clip.x + x + dx, y: ctx.clip.y + y + dy } );

// Setup and crop helpers

export async function scrollToLine( ctx, line, offset = 0 ) {
	await ctx.editorEval(
		( monaco, ed, a ) => ed.setScrollTop( ed.getTopForLineNumber( a.line ) + a.offset ),
		{ line, offset }
	);
	await ctx.page.waitForTimeout( 200 );
}

export async function resize( ctx, { width, height } ) {
	await ctx.page.evaluate(
		( { width, height } ) => {
			const host = document.querySelector( '.chbe-admin-editor-config-editor-preview' );
			if ( width ) {
				host.style.width = `${ width }px`;
			}
			if ( height ) {
				host.style.height = `${ height }px`;
			}
			window.monaco.editor.getEditors()[ 0 ].layout();
		},
		{ width, height }
	);
	await ctx.page.waitForTimeout( 300 );
}

export async function rectOf( ctx, selector ) {
	return ctx.page.evaluate( ( sel ) => {
		const el = document.querySelector( sel );
		if ( ! el ) {
			return null;
		}
		const r = el.getBoundingClientRect();
		return {
			x: r.left,
			y: r.top,
			width: r.width,
			height: r.height,
			right: r.right,
			bottom: r.bottom,
		};
	}, selector );
}

export async function layoutInfo( ctx ) {
	return ctx.editorEval( ( monaco, ed ) => ed.getLayoutInfo() );
}

export async function editorWidth( ctx ) {
	return ( await layoutInfo( ctx ) ).width;
}

// Resize so that a right-anchored widget (e.g. the find widget) starts at page x
// `left`. Measured on a wide editor first, since narrow editors shrink the widget.
export async function alignRightWidget( ctx, selector, left ) {
	await resize( ctx, { width: 1000 } );
	for ( let i = 0; i < 3; i++ ) {
		const r = await rectOf( ctx, selector );
		const delta = Math.round( left - r.x );
		if ( Math.abs( delta ) < 1 ) {
			return;
		}
		await resize( ctx, { width: ( await editorWidth( ctx ) ) + delta } );
	}
}

// For crops that end at the editor's right edge: resize the editor so that
// (line, column) is `ax` px from the left of a `W` px wide crop.
export async function fitRight( ctx, { line, column, ax, W } ) {
	const p = await ctx.pos( line, column );
	await resize( ctx, { width: Math.round( p.x - ctx.EX + W - ax ) } );
}

// A `clip` that ends at the editor's right edge, with line `line` `ay` px from the top.
export function rightClip( { line = 1, ay = 0 } = {} ) {
	return async ( ctx, W, H ) => {
		const p = await ctx.pos( line, 1 );
		return {
			x: ctx.EX + ( await editorWidth( ctx ) ) - W,
			y: Math.max( Math.round( p.y - ay ), ctx.EY ),
			width: W,
			height: H,
		};
	};
}

// A plain page background behind the editor, for crops that show the page.
export async function backdrop( ctx, color = '#f0f0f1' ) {
	await ctx.page.evaluate( ( c ) => {
		const el = document.createElement( 'div' );
		Object.assign( el.style, { position: 'fixed', inset: '0', background: c, zIndex: '100000' } );
		document.body.appendChild( el );
	}, color );
}

// Show the real control of a setting, found by searching its title on the
// settings screen, with its number input centered at page y `centerY`.
export async function placeSettingControl(
	ctx,
	title,
	{ left = ctx.EX + 8, centerY = ctx.EY - 22, width = 320 } = {}
) {
	await ctx.page.locator( '.chbe-admin-editor-config__settings input' ).first().fill( title );
	await ctx.page.waitForTimeout( 600 );
	await ctx.page.evaluate(
		( { title, left, centerY, width } ) => {
			const item = [
				...document.querySelectorAll( '.chbe-admin-editor-config__setting-item' ),
			].find( ( e ) => e.textContent.toLowerCase().startsWith( title.toLowerCase() ) );
			const input = item.querySelector( 'input[type="number"]' );
			const row = input.getBoundingClientRect();
			const rowCenter = row.top + row.height / 2 - item.getBoundingClientRect().top;
			Object.assign( item.style, {
				position: 'fixed',
				left: `${ left }px`,
				top: `${ centerY - rowCenter }px`,
				width: `${ width }px`,
				zIndex: '100002',
				margin: '0',
			} );
			item.dataset.capture = '1';
		},
		{ title, left, centerY, width }
	);
	await ctx.page.waitForTimeout( 300 );
}

// Put the editor in a scrollable box that stands for the page, `top` px below
// its top, for the page scrolling captures.
export async function inScrollablePage(
	ctx,
	{ width = 329, height = 320, top = 62, editorWidth: ew = 312, editorHeight: eh = 200 } = {}
) {
	await ctx.page.evaluate(
		( { x, y, width, height, top, ew, eh } ) => {
			const page = document.createElement( 'div' );
			Object.assign( page.style, {
				position: 'fixed',
				left: `${ x }px`,
				top: `${ y }px`,
				width: `${ width }px`,
				height: `${ height }px`,
				overflowY: 'scroll',
				overflowX: 'hidden',
				background: '#f0f0f1',
				zIndex: '100001',
			} );
			const host = document.querySelector( '.chbe-admin-editor-config-editor-preview' );
			const before = document.createElement( 'div' );
			before.style.height = `${ top }px`;
			const after = document.createElement( 'div' );
			after.style.height = '900px';
			page.append( before, host, after );
			Object.assign( host.style, {
				position: 'relative',
				left: '0',
				top: '0',
				width: `${ ew }px`,
				height: `${ eh }px`,
			} );
			document.body.appendChild( page );
			window.monaco.editor.getEditors()[ 0 ].layout();
		},
		{ x: ctx.EX, y: ctx.EY, width, height, top, ew, eh }
	);
	await ctx.page.waitForTimeout( 300 );
}

// Annotations

// The red arrows of the current image, for `annotations`. Each arrow moves with
// `ctx.map`; with `fixedX` / `fixedY`, that coordinate stays as in the image.
export function arrows( ctx, { fixedX = false, fixedY = false } = {} ) {
	return JSON.parse( py( `${ TOOL }/py/arrow_geom.py`, `${ IMG }/${ ctx.spec.rel }` ) ).map(
		( a ) => {
			const p = ctx.map( a.tip[ 0 ], a.tip[ 1 ] );
			return {
				type: 'arrow',
				...a,
				tip: [ fixedX ? a.tip[ 0 ] : p.x - ctx.clip.x, fixedY ? a.tip[ 1 ] : p.y - ctx.clip.y ],
			};
		}
	);
}
