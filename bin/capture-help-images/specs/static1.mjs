// Static images: comments, cursor, find.
/**
 * Internal dependencies
 */
import { SNIPPET, CONSOLAS, arrows, focusAt, alignRightWidget } from './common.mjs';

const specs = [];

// comments.insertSpace: toggle a line comment on line 1.
for ( const [ n, insertSpace ] of [
	[ 1, true ],
	[ 2, false ],
] ) {
	const rel = `editor-options/comments_insert-space_${ n }.jpg`;
	specs.push( {
		rel,
		options: { comments: { insertSpace } },
		value: 'This is comment text.\n<p>Lorem ipsum dolor sit amet</p>',
		caret: false,
		orig: { x0: 35, y0: -1, ...CONSOLAS },
		anchor: { line: 1, column: 1, ax: 35, ay: -1 },
		setup: async ( ctx ) => {
			await focusAt( ctx, 1, 1 );
			await ctx.editorEval( ( monaco, ed ) =>
				ed.trigger( 'keyboard', 'editor.action.commentLine', null )
			);
		},
		annotations: arrows( rel ),
	} );
}

// cursorStyle: caret at the start of the empty line 2.
const STYLES = [ 'line', 'line-thin', 'block', 'block-outline', 'underline', 'underline-thin' ];
const caretSpec = ( rel, options ) => ( {
	rel,
	options: { cursorBlinking: 'solid', ...options },
	value: '<p class="text">\n',
	anchor: { line: 2, column: 1, ax: 48, ay: 28 },
	setup: ( ctx ) => focusAt( ctx, 2, 1 ),
} );
STYLES.forEach( ( cursorStyle, i ) =>
	specs.push( caretSpec( `editor-options/cursor-style_${ i + 1 }.jpg`, { cursorStyle } ) )
);
specs.push( caretSpec( 'editor-options/cursor-blinking_5.jpg', {} ) );

// find.addExtraSpaceOnTop: the find widget opened with the cursor on line 4.
for ( const [ n, addExtraSpaceOnTop ] of [
	[ 1, true ],
	[ 2, false ],
] ) {
	specs.push( {
		rel: `editor-options/find/addextra-space-on-top_${ n }.jpg`,
		options: { find: { addExtraSpaceOnTop } },
		value: SNIPPET + '\n',
		caret: false,
		stage: { width: 368, height: 260 },
		anchor: { line: 4, column: 1, ax: 54, ay: addExtraSpaceOnTop ? 105 : 72 },
		setup: async ( ctx ) => {
			await focusAt( ctx, 4, 1 );
			await ctx.editorEval( ( monaco, ed ) => ed.trigger( 'keyboard', 'actions.find', null ) );
			await ctx.page.waitForTimeout( 500 );
			// The current Monaco keeps the scroll position when adding the extra
			// space, so scroll to the top like the original shows.
			await ctx.editorEval( ( monaco, ed ) => ed.setScrollTop( 0 ) );
			// The original crop starts at the gutter; the widget's left edge is at x=19.
			const p = await ctx.pos( 4, 1 );
			await alignRightWidget( ctx, '.find-widget', p.x - 54 + 19 );
		},
	} );
}

export default specs;
