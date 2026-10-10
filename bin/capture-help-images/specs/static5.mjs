// Static images: scrollbar options. Arrows point at scrollbar parts, so their
// tips are computed from the editor layout.
/**
 * Internal dependencies
 */
import { SNIPPET, arrows, focusAt, longDoc, fitRight, rightClip } from './common.mjs';

const specs = [];
const pair = ( name, values ) =>
	values.map( ( v, i ) => [ `editor-options/scrollbar/${ name }_${ i + 1 }.jpg`, v ] );
const layout = ( ctx ) => ctx.editorEval( ( monaco, ed ) => ed.getLayoutInfo() );

// Re-point the original arrow(s) at a tip computed from the layout.
const arrowAt = ( rel, tipFn ) => async ( ctx ) => {
	const [ a ] = await arrows( rel, { fixedX: true, fixedY: true } )( ctx );
	return [ { ...a, tip: tipFn( await layout( ctx ), ctx, a ) } ];
};

// Bottom-left crops: the crop's bottom edge is the editor's bottom edge.
const bottomLeftClip =
	( dx = 0 ) =>
	async ( ctx, W, H ) => {
		const l = await layout( ctx );
		return { x: ctx.EX + dx, y: ctx.EY + l.height - H, width: W, height: H };
	};

// arrowSize: the up arrow of the vertical scrollbar, top-right of the editor.
for ( const [ rel, arrowSize ] of pair( 'arrow-size', [ 10, 30 ] ) ) {
	specs.push( {
		rel,
		options: { scrollbar: { verticalHasArrows: true, arrowSize } },
		recreate: true,
		value: longDoc(),
		caret: false,
		showScrollbars: true,
		setup: ( ctx ) => fitRight( ctx, { line: 1, column: 24, ax: 185, W: 290 } ),
		clip: rightClip( { line: 1, ay: 0 } ),
		annotations: arrowAt( rel, ( l, ctx, a ) => [
			ctx.clip.width - l.verticalScrollbarWidth - 2,
			a.tip[ 1 ],
		] ),
	} );
}

// horizontalHasArrows: the left arrow of the horizontal scrollbar.
for ( const [ rel, horizontalHasArrows ] of pair( 'horizontal-has-arrows', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { scrollbar: { horizontalHasArrows } },
		recreate: true,
		value: SNIPPET + '\n',
		caret: false,
		showScrollbars: true,
		stage: { width: 380, height: 200 },
		clip: bottomLeftClip(),
		annotations: arrowAt( rel, ( l, ctx ) => [
			l.contentLeft + 5,
			ctx.clip.height - l.horizontalScrollbarHeight - 2,
		] ),
	} );
}

// horizontalScrollbarSize: scrolled to the end, cursor on the last line.
for ( const [ rel, horizontalScrollbarSize ] of pair( 'horizontal-scrollbar-size', [ 10, 30 ] ) ) {
	specs.push( {
		rel,
		options: { scrollbar: { horizontalScrollbarSize } },
		value: longDoc(),
		caret: false,
		showScrollbars: true,
		stage: { width: 390, height: 300 },
		setup: async ( ctx ) => {
			await focusAt( ctx, 364, 1 );
			// Show the last line right above the horizontal scrollbar.
			await ctx.editorEval( ( monaco, ed ) => {
				const l = ed.getLayoutInfo();
				ed.setScrollTop(
					ed.getTopForLineNumber( 364 ) +
						ed.getOption( monaco.editor.EditorOption.lineHeight ) -
						( l.height - l.horizontalScrollbarHeight )
				);
			} );
			await ctx.page.waitForTimeout( 200 );
		},
		clip: bottomLeftClip(),
		annotations: arrowAt( rel, ( l, ctx, a ) => [
			a.tip[ 0 ],
			ctx.clip.height - l.horizontalScrollbarHeight - 2,
		] ),
	} );
}

// horizontal: visible / hidden, the bottom-left of the content area.
for ( const [ rel, horizontal ] of pair( 'horizontal', [ 'auto', 'visible', 'hidden' ] ) ) {
	if ( rel.endsWith( '_1.jpg' ) ) {
		continue; // _1 is a GIF.
	}
	specs.push( {
		rel,
		options: { scrollbar: { horizontal } },
		value: SNIPPET + '\n',
		caret: false,
		showScrollbars: true,
		stage: { width: 600, height: 200 },
		anchor: { line: 1, column: 1, ax: 7, ay: -1 },
		annotations: arrowAt( rel, ( l, ctx, a ) => [ a.tip[ 0 ], ctx.clip.height - 10 - 13 ] ),
	} );
}

// useShadows (light theme): scrolled a little, so the top edge has a shadow.
for ( const [ rel, useShadows ] of pair( 'use-shadows', [ true, false ] ) ) {
	specs.push( {
		rel,
		theme: 'light',
		options: { scrollbar: { useShadows } },
		value: longDoc(),
		caret: false,
		showScrollbars: true,
		anchor: { line: 22, column: 1, ax: 55, ay: 22 },
		setup: async ( ctx ) => {
			await ctx.editorEval( ( monaco, ed ) =>
				ed.setScrollTop( ed.getTopForLineNumber( 22 ) - 22 )
			);
			await ctx.page.waitForTimeout( 200 );
		},
		annotations: arrows( rel, { fixedX: true, fixedY: true } ),
	} );
}

// verticalHasArrows: the up arrow at the top-right of the editor.
for ( const [ rel, verticalHasArrows ] of pair( 'vertical-has-arrows', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { scrollbar: { verticalHasArrows } },
		recreate: true,
		value: SNIPPET + '\n',
		caret: false,
		showScrollbars: true,
		stage: { width: 380, height: 200 },
		clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
		annotations: arrowAt( rel, ( l, ctx ) => [
			ctx.clip.width - l.verticalScrollbarWidth - 2,
			13,
		] ),
	} );
}

// verticalScrollbarSize: the right edge of the editor.
for ( const [ rel, verticalScrollbarSize ] of pair( 'vertical-scrollbar-size', [ 10, 30 ] ) ) {
	specs.push( {
		rel,
		options: { scrollbar: { verticalScrollbarSize } },
		value: SNIPPET + '\n',
		caret: false,
		showScrollbars: true,
		setup: ( ctx ) => fitRight( ctx, { line: 1, column: 38, ax: 211, W: 340 } ),
		clip: rightClip( { line: 1, ay: 0 } ),
		annotations: arrowAt( rel, ( l, ctx, a ) => [
			ctx.clip.width - l.verticalScrollbarWidth - 10,
			a.tip[ 1 ],
		] ),
	} );
}

// vertical: visible / hidden.
for ( const [ rel, vertical ] of pair( 'vertical', [ 'auto', 'visible', 'hidden' ] ) ) {
	if ( rel.endsWith( '_1.jpg' ) ) {
		continue; // _1 is a GIF.
	}
	specs.push( {
		rel,
		options: { scrollbar: { vertical } },
		value: SNIPPET + '\n',
		caret: false,
		showScrollbars: true,
		setup: ( ctx ) => fitRight( ctx, { line: 1, column: 38, ax: 195, W: 256 } ),
		clip: rightClip( { line: 1, ay: 0 } ),
		annotations: arrowAt( rel, ( l, ctx, a ) => [ ctx.clip.width - 10 - 12, a.tip[ 1 ] ] ),
	} );
}

export default specs;
