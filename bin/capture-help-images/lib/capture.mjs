// Capture session: places the preview editor, runs a spec and saves the image
// next to the current one as {name}_new.{ext}.
//
// A spec: {
//   rel: 'editor-options/foo.jpg',       // the image to capture, relative to IMG
//   value,                                // code (default: the preview code)
//   theme,                                // 'vs-dark' (default) or 'light'
//   options,                              // editor options over the plugin defaults
//   tabSize, insertSpaces,
//   recreate: true,                       // recreate the editor for options read at creation
//   stage: { width, height },             // editor size (default: 600 x 400)
//   stageX, stageY,                       // editor position on the page (default: 40, 40)
//   anchor: { line, column, ax, ay },     // (line, column) top-left lands at (ax, ay) in the image
//   clip( ctx, W, H ),                    // custom crop instead of `anchor`
//   allowOutside: true,                   // allow crops outside the editor (page background)
//   orig: { x0, y0, cw, lh },             // text grid of the current image, for `ctx.map`
//   setup( ctx ),                         // before cropping (static: the final state)
//   steps( ctx ) => [{ dur, x, y, down, mods, wheel, action }], // GIF timeline in page coordinates
//   annotations( ctx ) => [...],          // e.g. `arrows( ctx )`
//   caret: false,                         // hide the text caret
//   showScrollbars: true,                 // keep the scrollbars visible
//   cursor: true,                         // draw the mouse cursor and click marks (GIF)
//   moveMs,                               // how long the mouse moves between frames (default: 80)
// }
//
// The `ctx` passed to the functions: { page, spec, EX, EY, clip, fontInfo,
// editorEval( fn, arg ), css( text ), pos( line, column ), map( x, y ), track() }.
/**
 * External dependencies
 */
import fs from 'node:fs';
/**
 * Internal dependencies
 */
import {
	launch,
	openAdmin,
	stage,
	installCursor,
	replay,
	clipAt,
	editorEval,
	outPath,
	py,
	TOOL,
	WORK,
	IMG,
} from './cap.mjs';
import { PREVIEW_CODE } from './helpers.mjs';

const VIEW = { width: 1100, height: 760 };

export async function openSession() {
	const { page, close } = await launch( { viewport: VIEW } );
	return { page, capture: ( spec ) => capture( page, spec ), close };
}

async function capture( page, spec ) {
	const started = Date.now();
	// Where the editor is placed on the page (the admin menu is on the left).
	const EX = spec.stageX ?? 40;
	const EY = spec.stageY ?? 40;
	const work = `${ WORK }/work/${ spec.rel.replace( /[/.]/g, '_' ) }`;
	fs.rmSync( work, { recursive: true, force: true } );
	fs.mkdirSync( work, { recursive: true } );
	await page.mouse.move( VIEW.width - 1, VIEW.height - 1 );
	await openAdmin( page );
	await stage( page, {
		x: EX,
		y: EY,
		width: spec.stage?.width ?? 600,
		height: spec.stage?.height ?? 400,
		theme: spec.theme ?? 'vs-dark',
		options: spec.options ?? {},
		value: spec.value ?? PREVIEW_CODE,
		tabSize: spec.tabSize ?? 2,
		insertSpaces: spec.insertSpaces ?? true,
		recreate: spec.recreate ?? false,
	} );
	if ( spec.cursor ) {
		await installCursor( page );
	}
	// Let link detection, folding ranges and fonts settle.
	await page.waitForTimeout( 1200 );

	let track;
	const ctx = {
		page,
		spec,
		EX,
		EY,
		editorEval: ( fn, arg ) => editorEval( page, fn, arg ),
		css: ( content ) =>
			page.evaluate( ( c ) => {
				let el = document.getElementById( '__capture-style' );
				if ( ! el ) {
					el = document.createElement( 'style' );
					el.id = '__capture-style';
					document.head.appendChild( el );
				}
				el.textContent = c;
			}, content ),
		// Page position of the top-left of (line, column).
		pos: async ( line, column ) => {
			const p = await editorEval(
				page,
				( monaco, ed, a ) =>
					ed.getScrolledVisiblePosition( { lineNumber: a.line, column: a.column } ),
				{ line, column }
			);
			return { x: EX + p.left, y: EY + p.top, height: p.height };
		},
		// Frame durations, mouse positions and click marks of the current GIF.
		track: () => {
			track ??= JSON.parse(
				py( `${ TOOL }/py/track.py`, `${ IMG }/${ spec.rel }`, `${ WORK }/cursors` )
			);
			return track;
		},
	};
	ctx.fontInfo = await editorEval( page, ( monaco, ed ) => {
		const f = ed.getOption( monaco.editor.EditorOption.fontInfo );
		return { cw: f.typicalHalfwidthCharacterWidth, lh: f.lineHeight };
	} );
	const rules = [];
	if ( spec.caret === false ) {
		rules.push( '.monaco-editor .cursors-layer .cursor { visibility: hidden !important; }' );
	}
	// Scrollbars fade out without the mouse over the editor.
	if ( spec.showScrollbars ) {
		rules.push(
			'.monaco-editor .monaco-scrollable-element > .scrollbar.invisible.fade { opacity: 1 !important; transition: none !important; }'
		);
	}
	await ctx.css( rules.join( '\n' ) );
	if ( spec.setup ) {
		await spec.setup( ctx );
	}
	// Map image coordinates through the text grid, or relative to the crop without one.
	const origin = await ctx.pos( 1, 1 );
	ctx.map = ( x, y ) => {
		const o = spec.orig;
		if ( ! o ) {
			return { x: ctx.clip.x + x, y: ctx.clip.y + y };
		}
		return {
			x: origin.x + ( ( x - o.x0 ) / o.cw ) * ctx.fontInfo.cw,
			y: origin.y + ( ( y - o.y0 ) / o.lh ) * ctx.fontInfo.lh,
		};
	};

	const a = spec.anchor ?? { line: 1, column: 1, ax: 0, ay: 0 };
	const [ W, H ] = py(
		'-c',
		`from PIL import Image; im = Image.open('${ IMG }/${ spec.rel }'); print(im.size[0], im.size[1])`
	)
		.trim()
		.split( ' ' )
		.map( Number );
	const clip = spec.clip
		? await spec.clip( ctx, W, H )
		: await clipAt( page, { stageX: EX, stageY: EY, ...a, width: W, height: H } );
	ctx.clip = clip;
	const box = await editorEval( page, ( monaco, ed ) => ed.getLayoutInfo() );
	// Keep the crop inside the editor when it fits.
	if ( ! spec.allowOutside && clip.width <= box.width ) {
		clip.x = Math.min( Math.max( clip.x, EX ), EX + box.width - clip.width );
	}
	if ( ! spec.allowOutside && clip.height <= box.height ) {
		clip.y = Math.min( Math.max( clip.y, EY ), EY + box.height - clip.height );
	}
	if (
		clip.x < EX ||
		clip.y < EY ||
		clip.x + clip.width > EX + box.width ||
		clip.y + clip.height > EY + box.height
	) {
		console.log( `WARN ${ spec.rel }: the crop goes outside the editor`, clip, {
			width: box.width,
			height: box.height,
		} );
	}

	let annotationsPath;
	if ( spec.annotations ) {
		annotationsPath = `${ work }/annotations.json`;
		fs.writeFileSync( annotationsPath, JSON.stringify( await spec.annotations( ctx ) ) );
	}
	const crop = [ clip.x, clip.y, clip.width, clip.height ].join( ',' );
	const out = outPath( spec.rel );
	if ( spec.rel.endsWith( '.gif' ) ) {
		const steps = await spec.steps( ctx );
		await replay( page, { steps, outDir: `${ work }/frames`, moveMs: spec.moveMs ?? 80 } );
		py( `${ TOOL }/py/make_gif.py`, `${ work }/frames`, `${ work }/durations.json`, out, crop );
	} else {
		await page.waitForTimeout( 300 );
		await page.screenshot( { path: `${ work }/final.png`, clip: { x: 0, y: 0, ...VIEW } } );
		const args = [ `${ TOOL }/py/crop_save.py`, `${ work }/final.png`, crop, out ];
		if ( annotationsPath ) {
			args.push( annotationsPath );
		}
		py( ...args );
	}
	console.log(
		`${ out } (${ fs.statSync( out ).size } bytes, ${ ( ( Date.now() - started ) / 1000 ).toFixed( 1 ) }s)`
	);
	await ctx.css( '' );
	return out;
}
