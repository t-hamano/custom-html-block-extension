// Static images: folding highlight, ligatures, glyph margin, overview ruler, line numbers, links.
/**
 * Internal dependencies
 */
import {
	SNIPPET,
	PREVIEW,
	CONSOLAS,
	arrows,
	focusAt,
	longDoc,
	scrollToLine,
	resize,
	editorWidth,
} from './common.mjs';

const specs = [];
const pair = ( name, values ) =>
	values.map( ( v, i ) => [ `editor-options/${ name }_${ i + 1 }.jpg`, v ] );

// foldingHighlight: lines 4, 20 and 24 folded, line 3 at the top.
for ( const [ rel, foldingHighlight ] of pair( 'folding-highlight', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { foldingHighlight },
		value: longDoc(),
		caret: false,
		orig: { x0: 63.6, y0: -49, ...CONSOLAS },
		anchor: { line: 3, column: 1, ax: 63.6, ay: -1 },
		setup: async ( ctx ) => {
			await ctx.editorEval( ( monaco, ed ) =>
				ed.trigger( 'keyboard', 'editor.fold', {
					levels: 1,
					direction: 'down',
					selectionLines: [ 3, 19, 23 ],
				} )
			);
			await ctx.page.waitForTimeout( 300 );
			await scrollToLine( ctx, 3 );
		},
	} );
}

// fontLigatures: a script with operators, the cursor on the last line.
const LIGATURES = [
	'<script>',
	'const ligatureTest = () => {',
	'  console.log( a == b );',
	'  console.log( a === b );',
	'  console.log( a != b );',
	'  console.log( a !== b );',
	'  console.log( a <= b );',
	'  console.log( a >= b );',
	'  a++;',
	'  a--;',
	'};',
	'</script>',
	'',
].join( '\n' );
for ( const [ rel, fontLigatures ] of pair( 'font-ligatures', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { fontLigatures },
		value: LIGATURES,
		caret: false,
		anchor: { line: 1, column: 1, ax: 35, ay: 0 },
		setup: ( ctx ) => focusAt( ctx, 13, 1 ),
	} );
}

// glyphMargin: the arrow points at the margin left of the line numbers.
for ( const [ rel, glyphMargin ] of pair( 'glyph-margin', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { glyphMargin },
		value: '<p class="description">Lorem ipsum dolor sit amet</p>\n',
		caret: false,
		orig: { x0: glyphMargin ? 83 : 63, y0: 0, ...CONSOLAS },
		anchor: { line: 1, column: 1, ax: glyphMargin ? 83 : 63, ay: 0 },
		setup: ( ctx ) => focusAt( ctx, 2, 1 ),
		annotations: arrows( rel, { fixedX: true, fixedY: true } ),
	} );
}

// hideCursorInOverviewRuler: the right edge of the editor, cursor on line 3.
for ( const [ rel, hideCursorInOverviewRuler ] of pair( 'hide-cursor-in-overview-ruler', [
	true,
	false,
] ) ) {
	specs.push( {
		rel,
		options: { hideCursorInOverviewRuler },
		value: longDoc(),
		caret: false,
		stage: { width: 600, height: 400 },
		orig: { x0: 0, y0: 1, ...CONSOLAS },
		setup: async ( ctx ) => {
			// The end of line 2 is 105px left of the editor's right edge in the original.
			const p = await ctx.pos( 2, 42 );
			await resize( ctx, { width: Math.round( p.x - ctx.EX + 105 ) } );
			// Put the cursor on the line whose overview ruler mark is at the arrow (y=65).
			await ctx.editorEval( ( monaco, ed ) => {
				const lh = ed.getOption( monaco.editor.EditorOption.lineHeight );
				const line =
					Math.round( ( ( 65 - 1 ) / ed.getLayoutInfo().height ) * ( ed.getScrollHeight() / lh ) ) +
					1;
				ed.focus();
				ed.setPosition( { lineNumber: line, column: 1 } );
				ed.setScrollTop( 0 );
			} );
			await ctx.page.waitForTimeout( 300 );
		},
		clip: async ( ctx, W, H ) => {
			const p = await ctx.pos( 1, 1 );
			const width = await editorWidth( ctx );
			return { x: ctx.EX + width - W, y: Math.max( p.y - 1, ctx.EY ), width: W, height: H };
		},
		annotations: arrows( rel, { fixedX: true, fixedY: true } ),
	} );
}

// lineNumbers: off / on, cursor on line 11.
for ( const [ rel, lineNumbers ] of pair( 'line-numbers', [ 'off', 'on' ] ) ) {
	specs.push( {
		rel,
		options: { lineNumbers },
		value: PREVIEW,
		caret: false,
		anchor: { line: 1, column: 1, ax: lineNumbers === 'off' ? 26 : 78, ay: -1 },
		setup: ( ctx ) => focusAt( ctx, 11, 1 ),
	} );
}

// links: hovering the URL shows "Follow link" only when links are enabled.
for ( const [ rel, links ] of pair( 'links', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { links },
		value: SNIPPET + '\n',
		caret: false,
		orig: { x0: 33, y0: -12, ...CONSOLAS },
		anchor: { line: 2, column: 1, ax: 33, ay: 12 },
		setup: async ( ctx ) => {
			await focusAt( ctx, 5, 1 );
			const p = await ctx.pos( 4, 14 );
			await ctx.page.mouse.move( p.x, p.y + p.height / 2 );
			await ctx.page.waitForTimeout( 1500 );
		},
	} );
}

export default specs;
