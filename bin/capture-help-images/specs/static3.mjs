// Static images: minimap, occurrences highlight, overview ruler border.
/**
 * Internal dependencies
 */
import {
	SNIPPET,
	PREVIEW,
	arrows,
	focusAt,
	longDoc,
	scrollToLine,
	fitRight,
	rightClip,
} from './common.mjs';

const specs = [];
const pair = ( name, values, ext = 'jpg' ) =>
	values.map( ( v, i ) => [ `editor-options/${ name }_${ i + 1 }.${ ext }`, v ] );

// minimap.renderCharacters: the right part of the editor.
for ( const [ rel, renderCharacters ] of pair( 'minimap/render-characters', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { minimap: { renderCharacters } },
		value: longDoc(),
		caret: false,
		setup: ( ctx ) => fitRight( ctx, { line: 2, column: 42, ax: 163, W: 320 } ),
		clip: rightClip( { line: 2, ay: 23 } ),
	} );
}

// minimap.showSlider: always.
const REPEATED = Array( 8 ).fill( PREVIEW.trimEnd() ).join( '\n' ) + '\n';
specs.push( {
	rel: 'editor-options/minimap/show-slider_1.jpg',
	options: { minimap: { showSlider: 'always' } },
	value: REPEATED,
	caret: false,
	setup: ( ctx ) => fitRight( ctx, { line: 2, column: 37, ax: 77, W: 284 } ),
	clip: rightClip( { line: 2, ay: 20 } ),
} );

// minimap.side: the whole editor, scrolled to line 345.
for ( const [ rel, side ] of pair( 'minimap/side', [ 'left', 'right' ] ) ) {
	specs.push( {
		rel,
		options: { minimap: { side } },
		value: longDoc(),
		caret: false,
		stage: { width: 400, height: 300 },
		setup: ( ctx ) => scrollToLine( ctx, 345 ),
		clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY, width: W, height: H } ),
	} );
}

// minimap.size: proportional / fill / fit.
for ( const [ rel, size ] of pair( 'minimap/size', [ 'proportional', 'fill', 'fit' ] ) ) {
	specs.push( {
		rel,
		options: { minimap: { size } },
		value: longDoc(),
		caret: false,
		stage: { width: 600, height: 300 },
		setup: ( ctx ) => fitRight( ctx, { line: 2, column: 42, ax: 112, W: 250 } ),
		clip: rightClip( { line: 2, ay: 20 } ),
	} );
}

// occurrencesHighlight: the caret right after "h1".
for ( const [ rel, occurrencesHighlight ] of pair( 'occurrences-highlight', [
	'singleFile',
	'off',
] ) ) {
	specs.push( {
		rel,
		options: { occurrencesHighlight, cursorBlinking: 'solid' },
		value: '\n<h1 class="title">title</h1>\n<p>Lorem ipsum dolor sit amet</p>\n',
		anchor: { line: 2, column: 1, ax: 67, ay: 30 },
		setup: async ( ctx ) => {
			await focusAt( ctx, 2, 4 );
			await ctx.page.waitForTimeout( 1000 );
		},
	} );
}

// overviewRulerBorder: the right edge of the editor.
for ( const [ rel, overviewRulerBorder ] of pair( 'overview-ruler-border', [ true, false ] ) ) {
	specs.push( {
		rel,
		options: { overviewRulerBorder },
		value: SNIPPET + '\n',
		caret: false,
		setup: ( ctx ) => fitRight( ctx, { line: 1, column: 38, ax: 138, W: 345 } ),
		clip: rightClip( { line: 1, ay: 0 } ),
		// Point at the ruler's left border, which is narrower than in the original.
		annotations: async ( ctx ) => {
			const [ a ] = await arrows( rel, { fixedX: true, fixedY: true } )( ctx );
			const sb = await ctx.editorEval(
				( monaco, ed ) => ed.getLayoutInfo().verticalScrollbarWidth
			);
			return [ { ...a, tip: [ ctx.clip.width - sb - 1.5, a.tip[ 1 ] ] } ];
		},
	} );
}

export default specs;
