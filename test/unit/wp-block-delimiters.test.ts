/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { findBlockDelimiters } from '../../src/lib/wp-block-delimiters';

// Get the block names and texts of the delimiters to compare results easily.
const parse = ( text: string, languageId = 'html' ) => {
	const { pairs, unclosed, unopened } = findBlockDelimiters( text, languageId );
	const toText = ( { start, end }: { start: number; end: number } ) => text.slice( start, end );
	return {
		pairs: pairs.map( ( pair ) => pair.map( toText ) ),
		unclosed: unclosed.map( ( { name } ) => name ),
		unopened: unopened.map( ( { name } ) => name ),
	};
};

describe( 'findBlockDelimiters', () => {
	it( 'pairs opening and closing delimiters', () => {
		const text = '<!-- wp:paragraph -->\n<p>a</p>\n<!-- /wp:paragraph -->';
		expect( parse( text ) ).toEqual( {
			pairs: [ [ '<!-- wp:paragraph -->', '<!-- /wp:paragraph -->' ] ],
			unclosed: [],
			unopened: [],
		} );
	} );

	it( 'reports the offsets of block names', () => {
		const text = '<!-- wp:group {"a":1} -->\n<!-- /wp:group -->';
		const [ [ opener, closer ] ] = findBlockDelimiters( text, 'html' ).pairs;
		expect( opener ).toEqual( { name: 'wp:group', nameStart: 5, start: 0, end: 25 } );
		expect( text.slice( closer.nameStart, closer.nameStart + closer.name.length ) ).toBe(
			'wp:group'
		);
	} );

	it( 'pairs nested blocks with the same name', () => {
		const text = [
			'<!-- wp:group -->',
			'<!-- wp:group {"layout":{"type":"flex"}} -->',
			'<!-- /wp:group -->',
			'<!-- /wp:group -->',
		].join( '\n' );
		expect( parse( text ).pairs ).toEqual( [
			[ '<!-- wp:group {"layout":{"type":"flex"}} -->', '<!-- /wp:group -->' ],
			[ '<!-- wp:group -->', '<!-- /wp:group -->' ],
		] );
	} );

	it( 'skips void delimiters', () => {
		expect( parse( '<!-- wp:separator /-->\n<!-- wp:spacer {"height":"10px"} /-->' ) ).toEqual( {
			pairs: [],
			unclosed: [],
			unopened: [],
		} );
	} );

	it( 'treats a block without a namespace as a core block', () => {
		const text = '<!-- wp:paragraph -->\n<!-- /wp:core/paragraph -->';
		expect( parse( text ).pairs ).toHaveLength( 1 );
	} );

	it( 'pairs namespaced blocks', () => {
		const text = '<!-- wp:my-plugin/my-block -->\n<!-- /wp:my-plugin/my-block -->';
		expect( parse( text ).pairs ).toHaveLength( 1 );
		expect( parse( '<!-- wp:a/block -->\n<!-- /wp:b/block -->' ) ).toEqual( {
			pairs: [],
			unclosed: [ 'wp:a/block' ],
			unopened: [ 'wp:b/block' ],
		} );
	} );

	it( 'reports unclosed delimiters', () => {
		expect( parse( '<!-- wp:group -->\n<!-- wp:paragraph -->' ).unclosed ).toEqual( [
			'wp:group',
			'wp:paragraph',
		] );
	} );

	it( 'reports delimiters closed inside another block as unclosed', () => {
		const text = '<!-- wp:group -->\n<!-- wp:paragraph -->\n<!-- /wp:group -->';
		expect( parse( text ) ).toEqual( {
			pairs: [ [ '<!-- wp:group -->', '<!-- /wp:group -->' ] ],
			unclosed: [ 'wp:paragraph' ],
			unopened: [],
		} );
	} );

	it( 'reports unopened delimiters', () => {
		const text = '<!-- /wp:paragraph -->\n<!-- wp:group -->\n<!-- /wp:group -->';
		expect( parse( text ) ).toEqual( {
			pairs: [ [ '<!-- wp:group -->', '<!-- /wp:group -->' ] ],
			unclosed: [],
			unopened: [ 'wp:paragraph' ],
		} );
	} );

	it( 'ignores comments that are not block delimiters', () => {
		expect( parse( '<!-- comment -->\n<!--wp:paragraph-->\n<!-- wp:Paragraph -->' ) ).toEqual( {
			pairs: [],
			unclosed: [],
			unopened: [],
		} );
	} );

	it( 'skips delimiters in PHP code', () => {
		const text = [
			'<!-- wp:group -->',
			'<?php echo "<!-- /wp:group -->"; ?>',
			'<?= "<!-- wp:paragraph -->" ?>',
			'<!-- /wp:group -->',
			'<?php echo "<!-- wp:heading -->";',
		].join( '\n' );
		const result = parse( text, 'php' );
		expect( result ).toEqual( {
			pairs: [ [ '<!-- wp:group -->', '<!-- /wp:group -->' ] ],
			unclosed: [],
			unopened: [],
		} );
		// The offsets are the same as in the original text.
		const [ [ , closer ] ] = findBlockDelimiters( text, 'php' ).pairs;
		expect( closer.start ).toBe( text.lastIndexOf( '<!-- /wp:group -->' ) );
	} );

	it( 'does not skip PHP code in HTML', () => {
		const text = '<!-- wp:group -->\n<?php echo "<!-- /wp:group -->"; ?>';
		expect( parse( text, 'html' ).pairs ).toHaveLength( 1 );
	} );
} );
