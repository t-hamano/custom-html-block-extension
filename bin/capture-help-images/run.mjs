// Capture the editor config help images described in specs/*.mjs.
// usage: node run.mjs [name-substring ...]
// Without arguments, every image is captured. Each image is saved next to the
// current one as {name}_new.{ext}.
//
// A spec: {
//   rel: 'editor-options/foo.jpg',
//   theme, options, value, tabSize, insertSpaces, free,
//   stage: { width, height },            // editor size
//   stageX, stageY,                       // editor position on the page
//   anchor: { line, column, ax, ay },     // (line, column) top-left lands at (ax, ay) in the image
//   orig: { x0, y0, cw, lh },             // original text grid, to map original mouse coordinates
//   setup( ctx ),                         // before clipping (static: the final state)
//   clip( ctx, W, H ),                    // custom crop instead of anchor
//   steps( ctx ) => [{ dur, x, y, down, mods, wheel, action }], // GIF timeline in page coordinates
//   annotations( ctx ) => [...],          // drawn by crop_save.py
//   caret: true | false,                  // keep / hide the text caret (static only)
//   cursor: true,                         // draw the mouse cursor (GIF)
// }
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
} from './lib/cap.mjs';

const filters = process.argv.slice( 2 );
const specs = [];
for ( const file of fs.readdirSync( `${ TOOL }/specs` ).sort() ) {
	if ( file !== 'common.mjs' ) {
		specs.push( ...( await import( `${ TOOL }/specs/${ file }` ) ).default );
	}
}
const targets = specs.filter(
	( s ) => ! filters.length || filters.some( ( f ) => s.rel.includes( f ) )
);
if ( ! targets.length ) {
	console.error( 'No image matches.' );
	process.exit( 1 );
}
const VIEW = { width: 1100, height: 760 };

// Frame durations and mouse positions tracked in the original GIFs.
function originalTrack( rel ) {
	return JSON.parse(
		fs.readFileSync( `${ TOOL }/data/tracks/${ rel.replace( /\//g, '_' ) }.json`, 'utf8' )
	);
}

const { page, close } = await launch( { viewport: VIEW } );
try {
	for ( const spec of targets ) {
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
			value: spec.value ?? '',
			tabSize: spec.tabSize ?? 2,
			insertSpaces: spec.insertSpaces ?? true,
			free: spec.free ?? [],
			recreate: spec.recreate ?? false,
		} );
		if ( spec.cursor ) {
			await installCursor( page );
		}
		// Let link detection, folding ranges and fonts settle.
		await page.waitForTimeout( 1200 );

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
			track: () => originalTrack( spec.rel ),
		};
		ctx.fontInfo = await editorEval( page, ( monaco, ed ) => {
			const f = ed.getOption( monaco.editor.EditorOption.fontInfo );
			return { cw: f.typicalHalfwidthCharacterWidth, lh: f.lineHeight };
		} );
		const rules = [];
		if ( spec.caret === false ) {
			rules.push( '.monaco-editor .cursors-layer .cursor { visibility: hidden !important; }' );
		}
		// Scrollbars fade out without the mouse over the editor; the originals
		// were taken with them shown.
		if ( spec.showScrollbars ) {
			rules.push(
				'.monaco-editor .monaco-scrollable-element > .scrollbar.invisible.fade { opacity: 1 !important; transition: none !important; }'
			);
		}
		await ctx.css( rules.join( '\n' ) );
		if ( spec.setup ) {
			await spec.setup( ctx );
		}
		// Map original pixel coordinates through the text grid.
		let origin = await ctx.pos( 1, 1 );
		ctx.map = ( x, y ) => {
			const o = spec.orig;
			// Without a text grid, original coordinates are relative to the crop.
			if ( ! o ) {
				return { x: ctx.clip.x + x, y: ctx.clip.y + y };
			}
			return {
				x: origin.x + ( ( x - o.x0 ) / o.cw ) * ctx.fontInfo.cw,
				y: origin.y + ( ( y - o.y0 ) / o.lh ) * ctx.fontInfo.lh,
			};
		};

		origin = await ctx.pos( 1, 1 );

		const a = spec.anchor ?? { line: 1, column: 1, ax: 0, ay: 0 };
		const [ W, H ] = await imageSize( spec.rel );
		const clip = spec.clip
			? await spec.clip( ctx, W, H )
			: await clipAt( page, {
					stageX: EX,
					stageY: EY,
					line: a.line,
					column: a.column,
					ax: a.ax,
					ay: a.ay,
					width: W,
					height: H,
				} );
		ctx.clip = clip;
		const box0 = await editorEval( page, ( monaco, ed ) => ed.getLayoutInfo() );
		// Keep the crop inside the editor when it fits.
		if ( ! spec.allowOutside && clip.width <= box0.width ) {
			clip.x = Math.min( Math.max( clip.x, EX ), EX + box0.width - clip.width );
		}
		if ( ! spec.allowOutside && clip.height <= box0.height ) {
			clip.y = Math.min( Math.max( clip.y, EY ), EY + box0.height - clip.height );
		}
		if (
			clip.x < EX ||
			clip.y < EY ||
			clip.x + clip.width > EX + box0.width ||
			clip.y + clip.height > EY + box0.height
		) {
			console.log( `  WARN ${ spec.rel }: the crop goes outside the editor`, clip, {
				w: box0.width,
				h: box0.height,
			} );
		}

		let annotationsPath;
		if ( spec.annotations ) {
			annotationsPath = `${ work }/annotations.json`;
			fs.writeFileSync( annotationsPath, JSON.stringify( await spec.annotations( ctx ) ) );
		}
		const box = [ clip.x, clip.y, clip.width, clip.height ].join( ',' );
		if ( spec.rel.endsWith( '.gif' ) ) {
			const steps = await spec.steps( ctx );
			await replay( page, { steps, outDir: `${ work }/frames`, moveMs: spec.moveMs ?? 80 } );
			console.log(
				py(
					`${ TOOL }/py/make_gif.py`,
					`${ work }/frames`,
					`${ work }/durations.json`,
					outPath( spec.rel ),
					box
				).trim()
			);
		} else {
			await page.waitForTimeout( spec.settle ?? 300 );
			await page.screenshot( { path: `${ work }/final.png`, clip: { x: 0, y: 0, ...VIEW } } );
			const args = [ `${ TOOL }/py/crop_save.py`, `${ work }/final.png`, box, outPath( spec.rel ) ];
			if ( annotationsPath ) {
				args.push( annotationsPath );
			}
			console.log( py( ...args ).trim() );
		}
		console.log( `  ${ spec.rel } in ${ ( ( Date.now() - started ) / 1000 ).toFixed( 1 ) }s` );
		await ctx.css( '' );
	}
} finally {
	await close();
}

async function imageSize( rel ) {
	const out = py(
		'-c',
		`from PIL import Image; im = Image.open('${ IMG }/${ rel }'); print(im.size[0], im.size[1])`
	);
	return out.trim().split( ' ' ).map( Number );
}
