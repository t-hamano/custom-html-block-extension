/**
 * External dependencies
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';

/**
 * Internal dependencies
 */
import { getSupportedFontWeight, isDeepEqual, toNumber } from '../../src/lib/helper';

describe( 'toNumber', () => {
	it( 'converts strings to numbers', () => {
		expect( toNumber( '12' ) ).toBe( 12 );
		expect( toNumber( '1.5' ) ).toBe( 1.5 );
		expect( toNumber( 3 ) ).toBe( 3 );
	} );

	it( 'clamps values below the minimum', () => {
		expect( toNumber( -1 ) ).toBe( 0 );
		expect( toNumber( '5', 10 ) ).toBe( 10 );
	} );

	it( 'clamps values above the maximum', () => {
		expect( toNumber( 100, 0, 50 ) ).toBe( 50 );
		expect( toNumber( 50, 0, 50 ) ).toBe( 50 );
	} );

	it( 'does not clamp without a maximum', () => {
		expect( toNumber( 1e6 ) ).toBe( 1e6 );
	} );

	it( 'returns the minimum for NaN', () => {
		expect( toNumber( 'abc' ) ).toBe( 0 );
		expect( toNumber( 'abc', 8, 32 ) ).toBe( 8 );
		expect( toNumber( NaN, 3 ) ).toBe( 3 );
	} );
} );

describe( 'isDeepEqual', () => {
	it( 'compares primitives', () => {
		expect( isDeepEqual( 1, 1 ) ).toBe( true );
		expect( isDeepEqual( 'a', 'a' ) ).toBe( true );
		expect( isDeepEqual( 1, '1' ) ).toBe( false );
		expect( isDeepEqual( true, false ) ).toBe( false );
	} );

	it( 'ignores key order', () => {
		expect( isDeepEqual( { a: 1, b: { c: 2, d: 3 } }, { b: { d: 3, c: 2 }, a: 1 } ) ).toBe( true );
	} );

	it( 'detects different values and keys', () => {
		expect( isDeepEqual( { a: 1 }, { a: 2 } ) ).toBe( false );
		expect( isDeepEqual( { a: 1 }, { b: 1 } ) ).toBe( false );
		expect( isDeepEqual( { a: 1 }, { a: 1, b: 2 } ) ).toBe( false );
		expect( isDeepEqual( { a: { b: 1 } }, { a: { b: 2 } } ) ).toBe( false );
	} );

	it( 'compares arrays in order', () => {
		expect( isDeepEqual( [ 1, [ 2, 3 ] ], [ 1, [ 2, 3 ] ] ) ).toBe( true );
		expect( isDeepEqual( [ 1, 2 ], [ 2, 1 ] ) ).toBe( false );
		expect( isDeepEqual( [ 1 ], [ 1, 2 ] ) ).toBe( false );
	} );

	it( 'distinguishes arrays from objects', () => {
		expect( isDeepEqual( [ 'a' ], { 0: 'a' } ) ).toBe( false );
		expect( isDeepEqual( {}, [] ) ).toBe( false );
	} );

	it( 'handles null', () => {
		expect( isDeepEqual( null, null ) ).toBe( true );
		expect( isDeepEqual( null, {} ) ).toBe( false );
		expect( isDeepEqual( {}, null ) ).toBe( false );
		expect( isDeepEqual( { a: null }, { a: {} } ) ).toBe( false );
	} );
} );

describe( 'getSupportedFontWeight', () => {
	beforeAll( () => {
		vi.stubGlobal( 'window', {
			chbeObj: {
				fontFamily: [
					{ name: 'Fira Code', weight: [ 300, 400, 500, 600, 700 ] },
					{ name: 'Ubuntu Mono', weight: [ 300, 700 ] },
					{ name: 'No Weights' },
				],
			},
		} );
	} );

	it( 'keeps a weight that the font has', () => {
		expect( getSupportedFontWeight( 'Fira Code', '500' ) ).toBe( '500' );
		expect( getSupportedFontWeight( 'Ubuntu Mono', '700' ) ).toBe( '700' );
		expect( getSupportedFontWeight( 'monospace', '700' ) ).toBe( '700' );
	} );

	it( 'uses the normal weight, or the first one, of the font', () => {
		expect( getSupportedFontWeight( 'Fira Code', '800' ) ).toBe( '400' );
		expect( getSupportedFontWeight( 'Ubuntu Mono', '500' ) ).toBe( '300' );
		expect( getSupportedFontWeight( 'monospace', '300' ) ).toBe( '400' );
	} );

	it( 'keeps the weight for a font without weights', () => {
		expect( getSupportedFontWeight( 'No Weights', '500' ) ).toBe( '500' );
		expect( getSupportedFontWeight( 'Unknown Font', '500' ) ).toBe( '500' );
	} );
} );
