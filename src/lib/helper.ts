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

// Load a web font into the document, adding its stylesheet if it is not there yet.
// Resolves to whether the font was loaded within 5 seconds.
export const loadWebFont = async (
	font: FontFamily,
	ownerDocument: Document,
	weight = 'normal'
): Promise< boolean > => {
	const load = async () => {
		const { stylesheet } = font;
		if ( stylesheet && ! ownerDocument.querySelector( `link[href="${ stylesheet }"]` ) ) {
			const link = ownerDocument.createElement( 'link' );
			link.rel = 'stylesheet';
			link.href = stylesheet;
			const isLoaded = new Promise( ( resolve, reject ) => {
				link.onload = resolve;
				link.onerror = reject;
			} );
			ownerDocument.head.appendChild( link );
			await isLoaded;
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
