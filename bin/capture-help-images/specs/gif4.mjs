// GIFs operated by mouse: line number selection and folding.
/**
 * Internal dependencies
 */
import { timeline, focus } from './gif1.mjs';
import {
	PREVIEW,
	FIRA,
	mouseSteps,
	cropMap,
	foldingControl,
	clickAt,
	afterLineEnd,
	backdrop,
} from './common.mjs';

// The original folding captures have no empty last line.
const CODE = PREVIEW.trimEnd();

const specs = [];
const foldAll = ( ctx ) =>
	ctx.editorEval( ( monaco, ed ) => ed.trigger( 'keyboard', 'editor.foldAll', null ) );

// selectOnLineNumbers: clicking line numbers 1-4.
[
	[ true, [ 1, 6, 12, 21 ] ],
	[ false, [ 1, 4, 8, 13 ] ],
].forEach( ( [ selectOnLineNumbers, clicks ], i ) => {
	const rel = `editor-options/select-on-line-numbers_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { selectOnLineNumbers },
		value: PREVIEW,
		cursor: true,
		anchor: { line: 1, column: 1, ax: 69, ay: -1.5 },
		steps: ( ctx ) => mouseSteps( ctx, { map: cropMap( ctx ), down: clicks } ),
	} );
} );

// folding: click the folding controls of lines 1, 3, 4, 4, 3 and 1.
specs.push( {
	rel: 'editor-options/folding.gif',
	value: CODE,
	cursor: true,
	anchor: { line: 1, column: 1, ax: 75, ay: -1.5 },
	setup: foldAll,
	steps: async ( ctx ) => {
		// The original controls are at x=64; move the tracked path onto the current ones.
		const ctl = await foldingControl( ctx.page, 1 );
		const dx = ctl.x - ctx.clip.x - 64;
		const clicks = { 1: 1, 7: 3, 18: 4, 25: 4, 31: 3, 37: 1 };
		return mouseSteps( ctx, {
			map: cropMap( ctx, dx ),
			down: [],
			actions: Object.fromEntries(
				Object.entries( clicks ).map( ( [ f, line ] ) => [
					f,
					clickAt( ( page ) => foldingControl( page, line ) ),
				] )
			),
		} );
	},
} );

// foldingStrategy: toggle the fold of line 2 (closing tag misindented on line 5).
const STRATEGY = [
	'<div class="box">',
	'  <div class="col">',
	'    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
	'    </div>',
	'</div>',
	'',
].join( '\n' );
const toggleFold = ( page ) =>
	page.evaluate( () =>
		window.monaco.editor.getEditors()[ 0 ].trigger( 'keyboard', 'editor.toggleFold', null )
	);
[
	[ 'auto', [ 2, 5, 8, 11, 14 ] ],
	[ 'indentation', [ 1, 3, 4, 5, 6 ] ],
].forEach( ( [ foldingStrategy, toggles ], i ) => {
	const rel = `editor-options/folding-strategy_${ i + 1 }.gif`;
	specs.push( {
		rel,
		options: { foldingStrategy },
		value: STRATEGY,
		anchor: { line: 1, column: 1, ax: 63, ay: -1 },
		steps: () =>
			timeline( rel, {
				0: focus( 2, 20 ),
				...Object.fromEntries( toggles.map( ( f ) => [ f, toggleFold ] ) ),
			} ),
	} );
} );

// unfoldOnClickAfterEndOfLine: click after the end of folded lines 1, 3 and 4.
specs.push( {
	rel: 'editor-options/unfold-on-click-after-end-of-line.gif',
	options: { unfoldOnClickAfterEndOfLine: true },
	value: CODE,
	cursor: true,
	orig: { x0: 72, y0: 0, ...FIRA },
	anchor: { line: 1, column: 1, ax: 72, ay: 0 },
	setup: foldAll,
	// The tracked position is unreliable under the click mark, so click right
	// after the end of the folded line at the time of the click.
	steps: ( ctx ) =>
		mouseSteps( ctx, {
			map: ctx.map,
			down: [],
			actions: {
				1: clickAt( ( page ) => afterLineEnd( page, 1 ) ),
				9: clickAt( ( page ) => afterLineEnd( page, 3 ) ),
				16: clickAt( ( page ) => afterLineEnd( page, 4 ) ),
			},
		} ),
} );

// showFoldingControls: mouseover; the mouse enters the gutter from the page on the left.
specs.push( {
	rel: 'editor-options/show-folding-controls_2.gif',
	options: { showFoldingControls: 'mouseover' },
	value: CODE,
	cursor: true,
	allowOutside: true,
	// Right of the admin menu, so the page on the left is the light background.
	stageX: 220,
	setup: backdrop,
	clip: async ( ctx, W, H ) => ( { x: ctx.EX - 22, y: ctx.EY, width: W, height: H } ),
	steps: ( ctx ) => mouseSteps( ctx, { map: cropMap( ctx ), down: [] } ),
} );

// hover: the mouse rests on "h3", "src" and the URL.
specs.push( {
	rel: 'editor-options/hover.gif',
	value: PREVIEW,
	cursor: true,
	stageX: 60,
	stageY: 60,
	stage: { width: 540, height: 300 },
	clip: async ( ctx, W, H ) => ( { x: ctx.EX, y: ctx.EY + 100, width: W, height: H } ),
	// The gutter is 14px narrower than in the original, so the path moves left with the code.
	steps: ( ctx ) => mouseSteps( ctx, { map: cropMap( ctx, -14 ), down: [] } ),
} );

export default specs;
