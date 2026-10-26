/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { FontFamily } from '../types';

// Round values to the specified minimum and maximum values.
export const toNumber = ( value: string | number, min = 0, max: number | null = null ): number => {
	let num = Number( value );

	if ( isNaN( num ) || num < min ) {
		num = min;
	}

	if ( null !== max && num > max ) {
		num = max;
	}

	return num;
};

// Return a function that waits before finishing an operation, so that the
// spinner shown during it doesn't flash on fast responses. The wait resolves to
// `false` when the component unmounts, so that the rest of the operation can
// be skipped.
export const useWaitForSpinner = (): ( () => Promise< boolean > ) => {
	const isMounted = useRef( true );
	const pendingWaits = useRef( new Map< ReturnType< typeof setTimeout >, () => void >() );

	useEffect( () => {
		const waits = pendingWaits.current;
		isMounted.current = true;

		return () => {
			isMounted.current = false;
			waits.forEach( ( cancel, timeoutId ) => {
				clearTimeout( timeoutId );
				cancel();
			} );
			waits.clear();
		};
	}, [] );

	return useCallback(
		() =>
			new Promise< boolean >( ( resolve ) => {
				if ( ! isMounted.current ) {
					resolve( false );
					return;
				}

				const timeoutId = setTimeout( () => {
					pendingWaits.current.delete( timeoutId );
					resolve( true );
				}, 600 );
				pendingWaits.current.set( timeoutId, () => resolve( false ) );
			} ),
		[]
	);
};

// Whether two JSON-compatible values are deeply equal, regardless of key order.
export const isDeepEqual = ( a: unknown, b: unknown ): boolean => {
	if ( a === b ) {
		return true;
	}

	if ( typeof a !== 'object' || typeof b !== 'object' || null === a || null === b ) {
		return false;
	}

	if ( Array.isArray( a ) !== Array.isArray( b ) ) {
		return false;
	}

	const aRecord = a as Record< string, unknown >;
	const bRecord = b as Record< string, unknown >;
	const aKeys = Object.keys( aRecord );
	const bKeys = Object.keys( bRecord );

	if ( aKeys.length !== bKeys.length ) {
		return false;
	}

	return aKeys.every(
		( key ) =>
			Object.prototype.hasOwnProperty.call( bRecord, key ) &&
			isDeepEqual( aRecord[ key ], bRecord[ key ] )
	);
};

// Weights of the generic `monospace` font, which usually has only normal and
// bold faces.
export const MONOSPACE_FONT_WEIGHTS = [ 400, 700 ];

// Get a weight that the font has. Keep the weight if the font has it, or the
// font is not registered with weights. Otherwise use its normal weight, or its
// first one.
export const getSupportedFontWeight = ( fontFamily: string, fontWeight: string ): string => {
	const fontWeights =
		fontFamily === 'monospace'
			? MONOSPACE_FONT_WEIGHTS
			: window.chbeObj.fontFamily.find( ( { name } ) => name === fontFamily )?.weight;
	if ( ! fontWeights?.length || fontWeights.includes( Number( fontWeight ) ) ) {
		return fontWeight;
	}
	return String( fontWeights.includes( 400 ) ? 400 : fontWeights[ 0 ] );
};

// Stylesheets added by `loadWebFont()`, mapped to their load state.
const stylesheetLoads = new WeakMap< HTMLLinkElement, Promise< unknown > >();

// Load a web font into the document, adding its stylesheet if it is not there yet.
// Resolves to whether the font was loaded within 5 seconds.
export const loadWebFont = async (
	font: FontFamily,
	ownerDocument: Document,
	weight = 'normal'
): Promise< boolean > => {
	const load = async () => {
		const { stylesheet } = font;
		if ( stylesheet ) {
			let link = ownerDocument.querySelector< HTMLLinkElement >( `link[href="${ stylesheet }"]` );
			if ( ! link ) {
				const newLink = ownerDocument.createElement( 'link' );
				newLink.rel = 'stylesheet';
				newLink.href = stylesheet;
				stylesheetLoads.set(
					newLink,
					new Promise( ( resolve, reject ) => {
						newLink.onload = resolve;
						newLink.onerror = reject;
					} )
				);
				ownerDocument.head.appendChild( newLink );
				link = newLink;
			}
			// Wait for the stylesheet even if another editor added it and it is still loading.
			await stylesheetLoads.get( link );
		}
		const fontFaces = await ownerDocument.fonts.load( `${ weight } 1em "${ font.name }"` );
		return fontFaces.length > 0;
	};

	try {
		return await Promise.race( [
			load(),
			new Promise< boolean >( ( resolve ) => setTimeout( () => resolve( false ), 5000 ) ),
		] );
	} catch {
		return false;
	}
};
