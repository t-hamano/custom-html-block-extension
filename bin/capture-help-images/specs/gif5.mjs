// GIFs with a settings control above the editor. The control is the real one
// from the settings screen, found by searching its title and placed above the editor.
/**
 * Internal dependencies
 */
import { timeline } from './gif1.mjs';
import { PREVIEW, backdrop } from './common.mjs';

const specs = [];
const BAND = 44;
const X = 220; // right of the admin menu
const Y = 40;

// Show the setting control in the band above the editor, with its label above the crop.
async function placeControl( ctx, title ) {
	const search = ctx.page.locator( '.chbe-admin-editor-config__settings input' ).first();
	await search.fill( title );
	await ctx.page.waitForTimeout( 600 );
	await backdrop( ctx );
	await ctx.page.evaluate(
		( { title, X, Y, BAND } ) => {
			const item = [
				...document.querySelectorAll( '.chbe-admin-editor-config__setting-item' ),
			].find( ( e ) => e.textContent.toLowerCase().startsWith( title.toLowerCase() ) );
			const input = item.querySelector( 'input[type="number"]' );
			const before = item.getBoundingClientRect();
			const row = input.getBoundingClientRect();
			const rowCenter = row.top + row.height / 2 - before.top;
			Object.assign( item.style, {
				position: 'fixed',
				left: `${ X + 8 }px`,
				top: `${ Y + BAND / 2 - rowCenter }px`,
				width: '320px',
				zIndex: '100002',
				margin: '0',
			} );
			item.dataset.capture = '1';
		},
		{ title, X, Y, BAND }
	);
	await ctx.page.waitForTimeout( 300 );
}

// Type a value into the control and apply it to the editor.
const setValue = ( value, apply, after ) => async ( page ) => {
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

			const patch = new Function( 'v', `return (${ src })(v);` )( v );
			for ( const [ k, val ] of Object.entries( patch ) ) {
				window.__pinnedOptions[ k ] =
					val && typeof val === 'object' && ! Array.isArray( val )
						? { ...window.__pinnedOptions[ k ], ...val }
						: val;
			}
			ed.__origUpdateOptions( window.__pinnedOptions );
		},
		[ apply.toString(), value ]
	);
	if ( after ) {
		await after( page );
	}
};
const focusInput = async ( page ) =>
	page.locator( '[data-capture="1"] input[type="number"]' ).focus();
const scrollToEnd = ( page ) =>
	page.evaluate( () => {
		const ed = window.monaco.editor.getEditors()[ 0 ];
		ed.setScrollTop( ed.getScrollHeight() );
	} );

function settingsGif( {
	rel,
	title,
	W,
	H,
	values,
	focusAt,
	apply,
	options = {},
	value = PREVIEW,
	after,
	editorHeight,
	prepare,
} ) {
	specs.push( {
		rel,
		value,
		options: { ...options, ...apply( values[ 0 ] ) },
		stageX: X,
		stageY: Y + BAND,
		stage: { width: W, height: editorHeight ?? H - BAND + 40 },
		allowOutside: true,
		setup: async ( ctx ) => {
			if ( prepare ) {
				await prepare( ctx );
			}
			await placeControl( ctx, title );
			await setValue( values[ 0 ], apply, after )( ctx.page );
			await ctx.page.locator( '[data-capture="1"] input[type="number"]' ).blur();
			if ( after ) {
				await after( ctx.page );
			}
		},
		clip: async ( ctx, w, h ) => ( { x: X, y: Y, width: w, height: h } ),
		steps: () => {
			const actions = { [ focusAt ]: focusInput };
			values.forEach( ( v, i ) => {
				if ( i > 0 && v !== values[ i - 1 ] ) {
					actions[ i ] = setValue( v, apply, after );
				}
			} );
			return timeline( rel, actions );
		},
	} );
}

settingsGif( {
	rel: 'editor-options/padding/top.gif',
	title: 'Padding top (px)',
	W: 400,
	H: 320,
	values: [ 0, 0, 0, 10, 10, 20, 30, 40, 50, 50, 50, 40, 30, 20, 10, 10, 0, 0 ],
	focusAt: 1,
	apply: ( v ) => ( { padding: { top: v } } ),
} );
settingsGif( {
	rel: 'editor-options/padding/bottom.gif',
	title: 'Padding bottom (px)',
	W: 400,
	H: 294,
	values: [ 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 20, 30, 40, 50, 40, 40, 30, 30, 20, 10, 0 ],
	focusAt: 6,
	apply: ( v ) => ( { padding: { bottom: v } } ),
	options: { scrollBeyondLastLine: false },
	editorHeight: 294 - BAND,
	after: scrollToEnd,
} );
settingsGif( {
	rel: 'editor-options/rulers.gif',
	title: 'Vertical line position',
	W: 440,
	H: 280,
	values: [ 0, 0, 0, 5, 10, 10, 15, 20, 20, 25, 30, 30, 25, 25, 20, 20, 15, 15, 10, 10, 5, 0, 0 ],
	focusAt: 1,
	apply: ( v ) => ( { rulers: v > 0 ? [ v ] : [] } ),
} );
settingsGif( {
	rel: 'editor-options/line-decorations-width.gif',
	title: 'Folding area width (px)',
	W: 304,
	H: 240,
	values: [ 0, 0, 0, 10, 10, 20, 20, 20, 30, 30, 20, 10, 0, 0 ],
	focusAt: 1,
	apply: ( v ) => ( { lineDecorationsWidth: v } ),
} );
settingsGif( {
	rel: 'editor-options/line-numbers-min-chars.gif',
	title: 'Line number width',
	W: 302,
	H: 200,
	values: [ 2, 2, 2, 2, 4, 6, 6, 8, 8, 8, 10, 10, 8, 6, 4, 2 ],
	focusAt: 2,
	apply: ( v ) => ( { lineNumbersMinChars: v } ),
} );
settingsGif( {
	rel: 'editor-options/minimap/max-column.gif',
	title: 'Width',
	W: 529,
	H: 320,
	values: [ 50, 50, 50, 40, 40, 30, 30, 20, 20, 20, 10, 20, 20, 20, 30, 30, 40, 50, 50 ],
	focusAt: 1,
	apply: ( v ) => ( { minimap: { maxColumn: v } } ),
} );
settingsGif( {
	rel: 'editor-options/minimap/scale.gif',
	title: 'Scale',
	W: 468,
	H: 280,
	values: [ 1, 1, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 1, 1, 1 ],
	focusAt: 1,
	apply: ( v ) => ( { minimap: { scale: v } } ),
} );
settingsGif( {
	rel: 'editor-options/word-wrap-column.gif',
	title: 'Word wrap column',
	W: 536,
	H: 320,
	values: [
		50, 50, 50, 50, 45, 45, 40, 40, 40, 35, 30, 30, 30, 25, 25, 30, 30, 35, 35, 35, 40, 45, 45, 45,
		50,
	],
	focusAt: 0,
	apply: ( v ) => ( { wordWrapColumn: v } ),
	options: { wordWrap: 'wordWrapColumn' },
	// The column control is inert unless word wrap uses the column.
	prepare: async ( ctx ) => {
		const search = ctx.page.locator( '.chbe-admin-editor-config__settings input' ).first();
		await search.fill( 'Word wrap' );
		await ctx.page.waitForTimeout( 500 );
		await ctx.page
			.locator( '.chbe-admin-editor-config__setting-item select' )
			.first()
			.selectOption( 'wordWrapColumn' );
		await ctx.page.waitForTimeout( 300 );
	},
	value: [
		'<h1>' + 'Long long title.'.repeat( 6 ) + '</h1>',
		'',
		'<p>' + 'Long Long text.'.repeat( 9 ) + '</p>',
	].join( '\n' ),
} );

export default specs;
