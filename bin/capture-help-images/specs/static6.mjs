// Static images: selection highlight, folding controls, suggest widget, word wrap, context menu.
/**
 * Internal dependencies
 */
import { SNIPPET, PREVIEW, arrows, focusAt, rectOf, resize, editorWidth } from './common.mjs';

const specs = [];
const pair = ( name, values ) =>
	values.map( ( v, i ) => [ `editor-options/${ name }_${ i + 1 }.jpg`, v ] );

// selectionHighlight: "heading" selected in the class attribute of line 2.
const HEADINGS = [
	'<div class="container">',
	'  <h2 class="heading">This is heading.</h2>',
	'  <h3 class="subheading">This is subheading.</h3>',
	'  <div class="box">',
	'    <div class="col">',
	'      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'    </div>',
	'  </div>',
	'</div>',
].join( '\n' );
for ( const [ rel, selectionHighlight ] of pair( 'selection-highlight', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { selectionHighlight, cursorBlinking: 'solid' },
		value: HEADINGS,
		anchor: { line: 1, column: 1, ax: rel.endsWith( '_1.jpg' ) ? 7 : 54, ay: -1.5 },
		setup: async ( ctx ) => {
			await ctx.editorEval( ( monaco, ed ) => {
				ed.focus();
				ed.setSelection( new monaco.Selection( 2, 14, 2, 21 ) );
			} );
			await ctx.page.waitForTimeout( 800 );
		},
	} );
}

// showFoldingControls: always, cursor on line 1.
specs.push( {
	rel: 'editor-options/show-folding-controls_1.jpg',
	options: { showFoldingControls: 'always' },
	value: PREVIEW,
	caret: false,
	anchor: { line: 1, column: 1, ax: 83, ay: -1.5 },
	setup: ( ctx ) => focusAt( ctx, 1, 1 ),
} );

// The suggest widget after typing "<a".
const typeSuggest = async ( ctx ) => {
	await ctx.editorEval( ( monaco, ed ) => ed.focus() );
	await ctx.page.keyboard.type( '<a', { delay: 80 } );
	await ctx.page.waitForSelector( '.suggest-widget.visible' );
	await ctx.page.waitForTimeout( 600 );
};
for ( const [ rel, suggestFontSize ] of pair( 'suggest-font-size', [ 10, 30 ] ) ) {
	specs.push( {
		rel,
		options: { suggestFontSize, cursorBlinking: 'solid' },
		anchor: { line: 1, column: 1, ax: 54, ay: 0 },
		setup: typeSuggest,
	} );
}
for ( const [ rel, suggestLineHeight ] of pair( 'suggest-line-height', [ 10, 30 ] ) ) {
	specs.push( {
		rel,
		options: { suggestLineHeight, cursorBlinking: 'solid' },
		anchor: { line: 1, column: 1, ax: 53, ay: 0 },
		setup: typeSuggest,
	} );
}

// suggest.showIcons: the arrow points at the icon column, 15px below the widget.
for ( const [ rel, showIcons ] of pair( 'suggest/show-icons', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { suggest: { showIcons }, cursorBlinking: 'solid' },
		anchor: { line: 1, column: 1, ax: 80, ay: 0 },
		setup: typeSuggest,
		annotations: async ( ctx ) => {
			const [ a ] = await arrows( rel, { fixedX: true, fixedY: true } )( ctx );
			const widget = await rectOf( ctx, '.suggest-widget' );
			const row = await rectOf( ctx, '.suggest-widget .monaco-list-row .suggest-icon' );
			const label = await rectOf( ctx, '.suggest-widget .monaco-list-row .monaco-icon-label' );
			// Without icons, point at where they would be: the left edge of the labels.
			const x = showIcons ? row.x + row.width / 2 : label.x + 4;
			return [ { ...a, tip: [ x - ctx.clip.x, widget.bottom - ctx.clip.y + 15 ] } ];
		},
	} );
}

// wordWrap: off / on / wordWrapColumn / bounded. The column is set to where the
// original wraps the title.
const WRAP = [
	'<h1>' + 'Long long title.'.repeat( 6 ) + '</h1>',
	'',
	'<p>' + 'Long Long text.'.repeat( 9 ) + '</p>',
].join( '\n' );
for ( const [ rel, wordWrap ] of pair( 'word-wrap', [
	'off',
	'on',
	'wordWrapColumn',
	'bounded',
] ) ) {
	specs.push( {
		rel,
		options: { wordWrap, wordWrapColumn: 36 },
		value: WRAP,
		caret: false,
		stage: { width: 384, height: 300 },
		anchor: { line: 1, column: 1, ax: 43, ay: 0 },
	} );
}

// wrappingIndent: none / same / indent / deepIndent, with word wrap on.
const INDENT = [
	'<div class="row">',
	'  <div class="col">',
	'    <p>' + 'Long Long text.'.repeat( 9 ) + '</p>',
	'  </div>',
	'</div>',
].join( '\n' );
for ( const [ rel, wrappingIndent ] of pair( 'wrapping-indent', [
	'none',
	'same',
	'indent',
	'deepIndent',
] ) ) {
	specs.push( {
		rel,
		options: { wrappingIndent, wordWrap: 'on' },
		value: INDENT,
		caret: false,
		stage: { width: 420, height: 300 },
		anchor: { line: 1, column: 1, ax: 40, ay: 0 },
	} );
}

// contextmenu: right-click on the empty line 3.
specs.push( {
	rel: 'editor-options/contextmenu_1.jpg',
	value: SNIPPET + '\n',
	caret: false,
	clip: async ( ctx, W, H ) => {
		const p = await ctx.pos( 1, 1 );
		const clip = { x: Math.round( p.x - 4 ), y: ctx.EY, width: W, height: H };
		// Keep the minimap at x=380 like the original.
		for ( let i = 0; i < 4; i++ ) {
			const minimapLeft = await ctx.editorEval(
				( monaco, ed ) => ed.getLayoutInfo().minimap.minimapLeft
			);
			const delta = clip.x + 380 - ( ctx.EX + minimapLeft );
			if ( ! delta ) {
				break;
			}
			await resize( ctx, { width: ( await editorWidth( ctx ) ) + delta } );
		}
		await ctx.page.mouse.click( clip.x + 58, clip.y + 53, { button: 'right' } );
		await ctx.page.waitForTimeout( 600 );
		return clip;
	},
} );

export default specs;
