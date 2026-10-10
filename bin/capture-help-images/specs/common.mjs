// Shared content and helpers for the capture specs.
/**
 * External dependencies
 */
import fs from 'node:fs';
/**
 * Internal dependencies
 */
import { TOOL } from '../lib/cap.mjs';

// Snippet used by many of the original captures.
export const SNIPPET = [
	'<h1 class="title">This is title.</h1>',
	'<p>Lorem ipsum dolor sit amet</p>',
	'',
	'<a href="https://wordpress.org/" target="_blank">WordPress.org</a>',
].join( '\n' );

// The default code of the settings screen preview (2-space indent).
export const PREVIEW = `<div class="container">
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

// Original text grids.
export const CONSOLAS = { cw: 7.7, lh: 24 };
export const FIRA = { cw: 8.4, lh: 21 };

// Red arrows measured in the original images (py/arrow_geom.py).
const ARROWS = JSON.parse( fs.readFileSync( `${ TOOL }/data/arrows.json`, 'utf8' ) );

// Red arrows of the original, moved with the text they point at. With `fixedX`
// / `fixedY`, that coordinate stays where it is in the original image.
export function arrows( rel, { fixedX = false, fixedY = false } = {} ) {
	return async ( ctx ) =>
		ARROWS[ rel ].map( ( a ) => {
			const p = ctx.map( a.tip[ 0 ], a.tip[ 1 ] );
			return {
				type: 'arrow',
				...a,
				tip: [ fixedX ? a.tip[ 0 ] : p.x - ctx.clip.x, fixedY ? a.tip[ 1 ] : p.y - ctx.clip.y ],
			};
		} );
}

// A long document of repeated sections, used by the folding, minimap and
// scrollbar captures: line 3 + 15n is an <h3>, line 4 + 15n its box.
const LOREM =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
export function longDoc( sections = 24 ) {
	const lines = [ '<div class="container">', '  <h2 class="title">This is heading.</h2>' ];
	for ( let i = 0; i < sections; i++ ) {
		lines.push(
			'  <h3 class="subheading">This is subheading.</h3>',
			'  <div class="box">',
			'    <div class="col">',
			`      <p>${ LOREM }</p>`,
			`      <p>${ LOREM }</p>`,
			'    </div>',
			'    <div class="col">',
			'      <ul>',
			`        <li>${ LOREM }</li>`,
			`        <li>${ LOREM }</li>`,
			`        <li>${ LOREM }</li>`,
			`        <li>${ LOREM }</li>`,
			'      </ul>',
			'    </div>',
			'  </div>'
		);
	}
	lines.push( '</div>', '' );
	return lines.join( '\n' );
}

export async function scrollToLine( ctx, line, offset = 0 ) {
	await ctx.editorEval(
		( monaco, ed, a ) => ed.setScrollTop( ed.getTopForLineNumber( a.line ) + a.offset ),
		{ line, offset }
	);
	await ctx.page.waitForTimeout( 200 );
}

export async function focusAt( ctx, line, column ) {
	await ctx.editorEval(
		( monaco, ed, a ) => {
			ed.focus();
			ed.setPosition( { lineNumber: a.line, column: a.column } );
		},
		{ line, column }
	);
}

// Resize the editor (the preview host) and wait for the layout.
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

export async function editorWidth( ctx ) {
	return ctx.editorEval( ( monaco, ed ) => ed.getLayoutInfo().width );
}

// Resize so that a right-anchored widget's left edge lands at `left` (page x).
// Measured on a wide editor first, since narrow editors shrink the widget.
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

// Right-anchored crops: resize the editor so that (line, column) is `ax` px from
// the crop's left edge when the crop ends at the editor's right edge.
export async function fitRight( ctx, { line, column, ax, W } ) {
	const p = await ctx.pos( line, column );
	await resize( ctx, { width: Math.round( p.x - ctx.EX + W - ax ) } );
}

export function rightClip( { line = 1, ay = 0 } = {} ) {
	return async ( ctx, W, H ) => {
		const p = await ctx.pos( line, 1 );
		const width = await editorWidth( ctx );
		return {
			x: ctx.EX + width - W,
			y: Math.max( Math.round( p.y - ay ), ctx.EY ),
			width: W,
			height: H,
		};
	};
}

// Mouse steps from the tracked original cursor. `map( x, y )` converts original
// coordinates to page coordinates; the button is down in frames with a click mark.
export function mouseSteps( ctx, { map, down, actions = {}, overrides = {} } ) {
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

export const cropMap =
	( ctx, dx = 0, dy = 0 ) =>
	( x, y ) => ( { x: ctx.clip.x + x + dx, y: ctx.clip.y + y + dy } );

// Page position of the folding control of a line (evaluated when called).
export async function foldingControl( page, line ) {
	return page.evaluate( ( l ) => {
		const ed = window.monaco.editor.getEditors()[ 0 ];
		const info = ed.getLayoutInfo();
		const rect = ed.getDomNode().getBoundingClientRect();
		const p = ed.getScrolledVisiblePosition( { lineNumber: l, column: 1 } );
		return {
			x: rect.left + info.decorationsLeft + info.decorationsWidth - 8,
			y: rect.top + p.top + p.height / 2,
		};
	}, line );
}

// Page position a little after the end of a line (evaluated when called).
export async function afterLineEnd( page, line, gap = 30 ) {
	return page.evaluate(
		( [ l, g ] ) => {
			const ed = window.monaco.editor.getEditors()[ 0 ];
			const rect = ed.getDomNode().getBoundingClientRect();
			const col = ed.getModel().getLineMaxColumn( l );
			const p = ed.getScrolledVisiblePosition( { lineNumber: l, column: col } );
			return { x: rect.left + p.left + g, y: rect.top + p.top + p.height / 2 };
		},
		[ line, gap ]
	);
}

// Click at a position evaluated at the time of the click.
export const clickAt = ( where ) => async ( page ) => {
	const p = await where( page );
	await page.mouse.move( p.x, p.y );
	await page.mouse.down();
	await page.waitForTimeout( 60 );
	await page.mouse.up();
};

// A plain page background behind the editor, for crops that show the page.
export async function backdrop( ctx, color = '#f0f0f1' ) {
	await ctx.page.evaluate( ( c ) => {
		const el = document.createElement( 'div' );
		Object.assign( el.style, { position: 'fixed', inset: '0', background: c, zIndex: '100000' } );
		document.body.appendChild( el );
	}, color );
}
