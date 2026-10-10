// Shared helpers for capturing the editor config help images.
/**
 * External dependencies
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const TOOL = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );
export const ROOT = path.resolve( TOOL, '../..' );
export const IMG = `${ ROOT }/assets/images/admin/editor-config`;
export const WORK = process.env.CAPTURE_WORK_DIR || `${ ROOT }/artifacts/capture-help-images`;
export const BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8888';
export const ADMIN_URL = `${ BASE_URL }/wp-admin/options-general.php?page=custom-html-block-extension`;
const PYTHON = `${ WORK }/venv/bin/python`;

const require = createRequire( `${ ROOT }/package.json` );
const { chromium } = require( '@playwright/test' );

export function py( ...args ) {
	return execFileSync( PYTHON, args, { encoding: 'utf8' } );
}

// Prepare the Python environment and the Windows cursor images, and read the plugin defaults.
function setup() {
	fs.mkdirSync( WORK, { recursive: true } );
	if ( ! fs.existsSync( PYTHON ) ) {
		execFileSync( 'python3', [ '-m', 'venv', `${ WORK }/venv` ], { stdio: 'inherit' } );
		execFileSync( `${ WORK }/venv/bin/pip`, [ 'install', '-q', 'pillow', 'numpy' ], {
			stdio: 'inherit',
		} );
	}
	if ( ! fs.existsSync( `${ WORK }/cursors/cursors.json` ) ) {
		py(
			`${ TOOL }/py/extract_cursors.py`,
			process.env.WINDOWS_CURSORS_DIR || '/mnt/c/Windows/Cursors',
			`${ WORK }/cursors`
		);
	}
	const defaults = JSON.parse(
		execFileSync( 'php', [ `${ TOOL }/lib/defaults.php`, ROOT ], { encoding: 'utf8' } )
	);
	// The plugin saves rulers as an array.
	defaults.options.rulers = [];
	return defaults;
}

export const DEFAULTS = setup();

// Windows Chrome is the default, since it renders text like the original captures.
export async function launch( { viewport = { width: 1280, height: 900 } } = {} ) {
	let browser;
	let stopChrome = () => {};
	if ( process.env.CAPTURE_BROWSER === 'chromium' ) {
		browser = await chromium.launch();
	} else {
		const { startWindowsChrome } = await import( './wincdp.mjs' );
		const { endpoint, stop } = await startWindowsChrome();
		stopChrome = stop;
		browser = await chromium.connectOverCDP( endpoint, { timeout: 30000 } );
	}
	const context = await browser.newContext( { viewport, deviceScaleFactor: 1, locale: 'en-US' } );
	await context.grantPermissions( [ 'clipboard-read', 'clipboard-write' ], { origin: BASE_URL } );
	const page = await context.newPage();
	await page.goto( `${ BASE_URL }/wp-login.php` );
	await page.fill( '#user_login', process.env.WP_USERNAME || 'admin' );
	await page.fill( '#user_pass', process.env.WP_PASSWORD || 'password' );
	await page.click( '#wp-submit' );
	await page.waitForURL( /wp-admin/ );
	const close = async () => {
		await context.close().catch( () => {} );
		await browser.close().catch( () => {} );
		stopChrome();
	};
	return { browser, context, page, close };
}

export async function openAdmin( page ) {
	await page.goto( ADMIN_URL );
	await page.waitForFunction( () => window.monaco?.editor?.getEditors?.().length > 0 );
	await page.evaluate( () => document.fonts.ready );
	await page.waitForTimeout( 500 );
}

// Put the preview editor at a fixed position with a fixed size and apply
// options. Options passed here are pinned so that React re-renders can't revert them,
// except the `free` keys, which a settings control on the page drives.
export async function stage(
	page,
	{
		x = 0,
		y = 0,
		width,
		height,
		options = {},
		theme = 'vs-dark',
		value = '',
		tabSize = 2,
		insertSpaces = true,
		background,
		free = [],
		recreate = false,
	}
) {
	const opts = deepMerge( structuredClone( DEFAULTS.options ), options );
	const pinned = structuredClone( opts );
	free.forEach( ( k ) => delete pinned[ k ] );
	// The plugin's "Light" theme falls back to Monaco's `vs`; other names are the
	// plugin's themes in src/lib/themes.
	theme = theme === 'light' ? 'vs' : theme;
	const themeData = [ 'vs', 'vs-dark', 'hc-black' ].includes( theme )
		? null
		: JSON.parse( fs.readFileSync( `${ ROOT }/src/lib/themes/${ theme }.json`, 'utf8' ) );
	await page.evaluate(
		async ( {
			x,
			y,
			width,
			height,
			opts,
			pinned,
			theme,
			themeData,
			value,
			tabSize,
			insertSpaces,
			background,
			recreate,
		} ) => {
			const { monaco } = window;
			let ed = monaco.editor.getEditors()[ 0 ];
			const host = document.querySelector( '.chbe-admin-editor-config-editor-preview' );
			if ( host.parentElement !== document.body ) {
				document.body.appendChild( host );
			}
			Object.assign( host.style, {
				position: 'fixed',
				left: `${ x }px`,
				top: `${ y }px`,
				width: `${ width }px`,
				height: `${ height }px`,
				zIndex: 100001,
				margin: 0,
			} );
			if ( background ) {
				document.body.style.background = background;
			}
			if ( ! ed.__origUpdateOptions ) {
				ed.__origUpdateOptions = ed.updateOptions.bind( ed );
				ed.updateOptions = ( o ) => ed.__origUpdateOptions( { ...o, ...window.__pinnedOptions } );
			}
			window.__pinnedOptions = pinned;
			ed.__origUpdateOptions( opts );
			// Some options (e.g. scrollbar arrows) are only read when the editor is created.
			if ( recreate ) {
				const container = ed.getContainerDomNode();
				// The old editor owns its model and disposes it.
				const model = monaco.editor.createModel( '', 'html' );
				ed.dispose();
				ed = monaco.editor.create( container, { ...opts, model } );
				ed.__origUpdateOptions = ed.updateOptions.bind( ed );
			}
			if ( themeData ) {
				monaco.editor.defineTheme( theme, themeData );
			}
			monaco.editor.setTheme( theme );
			ed.getModel().updateOptions( { tabSize, insertSpaces } );
			ed.getModel().setValue( value );
			ed.setScrollPosition( { scrollTop: 0, scrollLeft: 0 } );
			await document.fonts.load(
				`${ opts.fontWeight } ${ opts.fontSize }px "${ opts.fontFamily }"`
			);
			await document.fonts.ready;
			monaco.editor.remeasureFonts();
			ed.layout();
		},
		{
			x,
			y,
			width,
			height,
			opts,
			pinned,
			theme,
			themeData,
			value,
			tabSize,
			insertSpaces,
			background,
			recreate,
		}
	);
	await page.waitForTimeout( 400 );
}

export function deepMerge( target, src ) {
	for ( const [ k, v ] of Object.entries( src ) ) {
		if (
			v &&
			typeof v === 'object' &&
			! Array.isArray( v ) &&
			target[ k ] &&
			typeof target[ k ] === 'object'
		) {
			deepMerge( target[ k ], v );
		} else {
			target[ k ] = v;
		}
	}
	return target;
}

export async function editorEval( page, fn, arg ) {
	return page.evaluate(
		( [ src, arg ] ) => {
			const { monaco } = window;
			const ed = monaco.editor.getEditors()[ 0 ];

			return new Function( 'monaco', 'ed', 'arg', `return (${ src })(monaco, ed, arg);` )(
				monaco,
				ed,
				arg
			);
		},
		[ fn.toString(), arg ]
	);
}

// Draw a Windows-like mouse cursor that follows the mouse, since screenshots
// don't include the OS cursor. The shape follows the CSS `cursor` under the mouse.
// `wheel` also draws a mouse icon whose wheel lights up while the wheel turns, and
// `pointer: false` draws the icon alone.
export async function installCursor( page, { wheel = false, pointer = true } = {} ) {
	const meta = JSON.parse( fs.readFileSync( `${ WORK }/cursors/cursors.json`, 'utf8' ) );
	const png = ( name ) =>
		'data:image/png;base64,' +
		fs.readFileSync( `${ WORK }/cursors/${ name }.png` ).toString( 'base64' );
	await page.evaluate(
		( { arrow, link, meta, wheel, pointer } ) => {
			const el = document.createElement( 'div' );
			el.id = '__cursor';
			Object.assign( el.style, {
				position: 'fixed',
				left: '0',
				top: '0',
				zIndex: '2147483647',
				pointerEvents: 'none',
				display: 'none',
			} );
			document.body.appendChild( el );
			// The click mark of the original captures: a translucent yellow disc
			// under the cursor, shown while the button is down (at least 150ms).
			const mark = document.createElement( 'div' );
			Object.assign( mark.style, {
				position: 'fixed',
				left: '0',
				top: '0',
				width: '30px',
				height: '30px',
				borderRadius: '50%',
				background: 'rgba(242, 238, 10, 0.5)',
				zIndex: '2147483646',
				pointerEvents: 'none',
				display: 'none',
			} );
			document.body.appendChild( mark );
			let downAt = 0;
			let hideTimer;
			const placeMark = ( x, y ) =>
				( mark.style.transform = `translate(${ x - 15 }px, ${ y - 15 }px)` );
			const onDown = ( e ) => {
				clearTimeout( hideTimer );
				downAt = Date.now();
				placeMark( e.clientX, e.clientY );
				mark.style.display = 'block';
			};
			const onUp = () => {
				clearTimeout( hideTimer );
				hideTimer = setTimeout(
					() => ( mark.style.display = 'none' ),
					Math.max( 0, downAt + 150 - Date.now() )
				);
			};
			document.addEventListener( 'pointerdown', onDown, true );
			document.addEventListener( 'mousedown', onDown, true );
			document.addEventListener( 'pointerup', onUp, true );
			document.addEventListener( 'mouseup', onUp, true );
			// The Windows I-beam inverts the pixels below it.
			const kinds = {
				text: {
					html: '<svg width="7" height="16" style="display:block" shape-rendering="crispEdges"><path fill="#fff" d="M0 0h3v1H0zM4 0h3v1H4zM3 1h1v14H3zM0 15h3v1H0zM4 15h3v1H4z"/></svg>',
					hx: 3,
					hy: 8,
					blend: 'difference',
				},
				pointer: {
					html: `<img src="${ link }" style="display:block">`,
					hx: meta.aero_link.hx,
					hy: meta.aero_link.hy,
					blend: 'normal',
				},
				default: {
					html: `<img src="${ arrow }" style="display:block">`,
					hx: 0,
					hy: 0,
					blend: 'normal',
				},
			};
			let current = null;
			let forced = null;
			const update = ( x, y ) => {
				let kind = forced;
				if ( ! kind ) {
					const target = document.elementFromPoint( x, y );
					const css = target ? getComputedStyle( target ).cursor : 'default';
					kind = [ 'text', 'pointer' ].includes( css ) ? css : 'default';
				}
				const k = kinds[ kind ];
				if ( current !== kind ) {
					el.innerHTML = k.html;
					el.style.mixBlendMode = k.blend;
					current = kind;
				}
				el.style.display = pointer ? 'block' : 'none';
				el.style.transform = `translate(${ x - k.hx }px, ${ y - k.hy }px)`;
			};
			// A mouse icon next to the cursor; its wheel lights up with an arrow of
			// the direction while the wheel turns.
			let placeIcon = () => {};
			if ( wheel ) {
				const icon = document.createElement( 'div' );
				Object.assign( icon.style, {
					position: 'fixed',
					left: '0',
					top: '0',
					zIndex: '2147483647',
					pointerEvents: 'none',
					display: 'none',
				} );
				icon.innerHTML =
					'<svg width="28" height="26" viewBox="0 0 28 26" style="display:block">' +
					'<rect x="1" y="1" width="15" height="23" rx="7.5" fill="#fff" stroke="#1e1e1e" stroke-width="1.5"/>' +
					'<path d="M1.5 10.5H15.5M8.5 1.5V10.5" stroke="#1e1e1e" stroke-width="1"/>' +
					'<rect class="w" x="7" y="3.5" width="3" height="5.5" rx="1.5" fill="#8c8f94"/>' +
					'<path class="u" d="M22.5 1 L27 7 H24.5 V12 H20.5 V7 H18 Z" fill="#3582c4" stroke="#fff" stroke-width="1" visibility="hidden"/>' +
					'<path class="d" d="M22.5 25 L27 19 H24.5 V14 H20.5 V19 H18 Z" fill="#3582c4" stroke="#fff" stroke-width="1" visibility="hidden"/>' +
					'</svg>';
				document.body.appendChild( icon );
				const w = icon.querySelector( '.w' );
				const up = icon.querySelector( '.u' );
				const down = icon.querySelector( '.d' );
				let idle;
				document.addEventListener(
					'wheel',
					( e ) => {
						clearTimeout( idle );
						w.setAttribute( 'fill', '#3582c4' );
						up.setAttribute( 'visibility', e.deltaY < 0 ? 'visible' : 'hidden' );
						down.setAttribute( 'visibility', e.deltaY > 0 ? 'visible' : 'hidden' );
						idle = setTimeout( () => {
							w.setAttribute( 'fill', '#8c8f94' );
							up.setAttribute( 'visibility', 'hidden' );
							down.setAttribute( 'visibility', 'hidden' );
						}, 250 );
					},
					{ capture: true, passive: true }
				);
				placeIcon = ( x, y ) => {
					icon.style.display = 'block';
					// Without the cursor, the mouse icon itself marks the mouse position.
					icon.style.transform = pointer
						? `translate(${ x + 13 }px, ${ y + 16 }px)`
						: `translate(${ x - 8 }px, ${ y - 12 }px)`;
				};
			}
			let last = [ 0, 0 ];
			// Depending on the gesture, Monaco suppresses either the pointer or the
			// mouse events, so listen to both.
			const onMove = ( e ) => {
				last = [ e.clientX, e.clientY ];
				update( e.clientX, e.clientY );
				placeMark( e.clientX, e.clientY );
				placeIcon( e.clientX, e.clientY );
			};
			document.addEventListener( 'pointermove', onMove, true );
			document.addEventListener( 'mousemove', onMove, true );
			window.__cursor = {
				force: ( kind ) => {
					forced = kind;
					update( ...last );
				},
				hide: () => ( el.style.display = 'none' ),
				refresh: () => update( ...last ),
			};
		},
		{ arrow: png( 'aero_arrow' ), link: png( 'aero_link' ), meta, wheel, pointer }
	);
}

// Replay a timeline in real time while recording the page with a CDP screencast,
// then save the frame that was on screen at each original frame time.
//
// steps: [{ dur, x?, y?, mods?, down?, wheel?, action? }] in original frame order.
// The mouse rests at (x, y) and moves to the next position during the last
// `moveMs` of the frame. At the start of a frame, `mods` (held modifier keys),
// `down` (true / false / 2 for a double click), `wheel` ({ dx, dy }) and then
// `action( page )` are applied.
export async function replay( page, { steps, outDir, moveMs = 80, lead = 90 } ) {
	fs.rmSync( outDir, { recursive: true, force: true } );
	fs.mkdirSync( outDir, { recursive: true } );
	const cdp = await page.context().newCDPSession( page );
	const shots = [];
	cdp.on( 'Page.screencastFrame', ( { data, metadata, sessionId } ) => {
		shots.push( { t: metadata.timestamp * 1000, data } );
		cdp.send( 'Page.screencastFrameAck', { sessionId } ).catch( () => {} );
	} );
	if ( steps[ 0 ].x !== undefined ) {
		await page.mouse.move( steps[ 0 ].x, steps[ 0 ].y );
	}
	await page.waitForTimeout( 800 );
	await cdp.send( 'Page.startScreencast', { format: 'png' } );
	await page.waitForTimeout( 300 );

	// Map local time to browser time to match screencast timestamps.
	const before = Date.now();
	const browserNow = await page.evaluate( () => Date.now() );
	const offset = browserNow - ( before + ( Date.now() - before ) / 2 );

	const start = Date.now() + 50;
	const sleepUntil = async ( t ) => {
		const wait = start + t - Date.now();
		if ( wait > 0 ) {
			await new Promise( ( r ) => setTimeout( r, wait ) );
		}
	};
	const times = [];
	let t = 0;
	let isDown = false;
	const held = new Set();
	for ( let i = 0; i < steps.length; i++ ) {
		const step = steps[ i ];
		times.push( t );
		await sleepUntil( t );
		if ( step.mods ) {
			for ( const m of [ ...held ] ) {
				if ( ! step.mods.includes( m ) ) {
					await page.keyboard.up( m );
					held.delete( m );
				}
			}
			for ( const m of step.mods ) {
				if ( ! held.has( m ) ) {
					await page.keyboard.down( m );
					held.add( m );
				}
			}
		}
		if ( step.down !== undefined && Boolean( step.down ) !== isDown ) {
			if ( step.down ) {
				await page.mouse.down( { clickCount: step.down === 2 ? 2 : 1 } );
			} else {
				await page.mouse.up();
			}
			isDown = Boolean( step.down );
		}
		if ( step.wheel ) {
			await page.mouse.wheel( step.wheel.dx ?? 0, step.wheel.dy ?? 0 );
		}
		if ( step.action ) {
			await step.action( page );
		}
		const next = steps[ i + 1 ];
		if ( isDown && ! ( next && next.down ) ) {
			await sleepUntil( t + Math.min( 90, step.dur - 10 ) );
			await page.mouse.up();
			isDown = false;
		}
		if (
			next &&
			next.x !== undefined &&
			step.x !== undefined &&
			( next.x !== step.x || next.y !== step.y )
		) {
			const span = Math.min( moveMs, step.dur );
			const n = Math.max( 1, Math.round( span / 20 ) );
			for ( let k = 1; k <= n; k++ ) {
				await sleepUntil( t + step.dur - span + ( span * k ) / n - 1 );
				await page.mouse.move(
					step.x + ( ( next.x - step.x ) * k ) / n,
					step.y + ( ( next.y - step.y ) * k ) / n
				);
			}
		}
		t += step.dur;
	}
	await sleepUntil( t );
	if ( isDown ) {
		await page.mouse.up();
	}
	for ( const m of held ) {
		await page.keyboard.up( m );
	}
	await cdp.send( 'Page.stopScreencast' );
	await cdp.detach();

	times.forEach( ( ti, i ) => {
		// Sample late in the frame so that actions have taken effect.
		const target = start + offset + ti + Math.min( lead, Math.max( 10, steps[ i ].dur - 15 ) );
		let pick = shots[ 0 ];
		for ( const s of shots ) {
			if ( s.t <= target ) {
				pick = s;
			}
		}
		fs.writeFileSync(
			`${ outDir }/${ String( i ).padStart( 4, '0' ) }.png`,
			Buffer.from( pick.data, 'base64' )
		);
	} );
	fs.writeFileSync(
		`${ outDir }/../durations.json`,
		JSON.stringify( steps.map( ( s ) => s.dur ) )
	);
	return { shots: shots.length, frames: steps.length };
}

// Clip so that the top-left of (line, column) lands at (ax, ay) in the image,
// like in the original. The clip is kept inside the editor.
export async function clipAt(
	page,
	{ stageX, stageY, line = 1, column = 1, ax, ay, width, height }
) {
	const pos = await editorEval(
		page,
		( monaco, ed, a ) => ed.getScrolledVisiblePosition( { lineNumber: a.line, column: a.column } ),
		{ line, column }
	);
	return {
		x: Math.max( Math.round( stageX + pos.left - ax ), stageX ),
		y: Math.max( Math.round( stageY + pos.top - ay ), stageY ),
		width,
		height,
	};
}

export function outPath( rel ) {
	const ext = path.extname( rel );
	return `${ IMG }/${ rel.slice( 0, -ext.length ) }_new${ ext }`;
}
