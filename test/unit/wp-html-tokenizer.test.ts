/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { extendLanguage } from '../../src/lib/wp-html-tokenizer';

// A minimal built-in language definition with the rules that `extendLanguage()` relies on.
const builtInLanguage = {
	defaultToken: '',
	tokenPostfix: '.html',
	tokenizer: {
		root: [ [ /<!--/, 'comment', '@comment' ], [ /[^<]+/ ] ],
		comment: [ [ /-->/, 'comment', '@pop' ] ],
	},
} as unknown as Monaco.languages.IMonarchLanguage;

type Rule = [ string, ...unknown[] ];

const extend = ( languageId: 'html' | 'php' ) => {
	const language = extendLanguage( builtInLanguage, languageId );
	return {
		language,
		tokenizer: language.tokenizer as unknown as Record< string, Rule[] >,
	};
};

describe( 'extendLanguage', () => {
	it( 'keeps the built-in definition', () => {
		const { language, tokenizer } = extend( 'html' );
		expect( language.tokenPostfix ).toBe( '.html' );
		expect( tokenizer.comment ).toEqual( [ [ '-->', 'comment', '@pop' ] ] );
	} );

	it( 'keeps root as the first state', () => {
		expect( Object.keys( extend( 'html' ).tokenizer )[ 0 ] ).toBe( 'root' );
	} );

	it( 'adds the WordPress rules before the built-in root rules', () => {
		const { root } = extend( 'html' ).tokenizer;
		expect( root.map( ( [ regex ] ) => regex ) ).toEqual( [
			'(<!--)(\\s+)(@blockName)',
			'(<!--)(\\s+)(\\/)(@blockName)',
			'(\\[\\/?)([a-z_][\\w\\-]*)',
			'<!--',
			'[^<\\[]+',
			'\\[',
		] );
	} );

	it( 'adds the WordPress states', () => {
		const { tokenizer } = extend( 'html' );
		expect( tokenizer ).toHaveProperty( 'blockDelimiter' );
		expect( tokenizer ).toHaveProperty( 'blockAttributes' );
		expect( tokenizer ).toHaveProperty( 'shortcode' );
	} );

	it( 'serializes all regular expressions', () => {
		const { language } = extend( 'php' );
		const hasRegExp = ( value: unknown ): boolean =>
			value instanceof RegExp ||
			( !! value && typeof value === 'object' && Object.values( value ).some( hasRegExp ) );
		expect( hasRegExp( language ) ).toBe( false );
	} );

	it( 'uses tokens without a postfix in HTML', () => {
		const { root, shortcode } = extend( 'html' ).tokenizer;
		expect( root[ 2 ] ).toEqual( [
			'(\\[\\/?)([a-z_][\\w\\-]*)',
			[ 'delimiter', { token: 'keyword.flow', next: '@shortcode' } ],
		] );
		expect( shortcode.some( ( [ regex ] ) => regex.startsWith( '<\\?' ) ) ).toBe( false );
	} );

	it( 'uses tokens with the HTML postfix and switches to PHP code in PHP', () => {
		const { root, blockDelimiter, blockAttributes, shortcode } = extend( 'php' ).tokenizer;
		expect( root[ 2 ] ).toEqual( [
			'(\\[\\/?)([a-z_][\\w\\-]*)',
			[ 'delimiter.html', { token: 'keyword.flow.html', next: '@shortcode' } ],
		] );
		expect( blockDelimiter[ 0 ] ).toEqual( [
			'<\\?((php)|=)?',
			{ token: '@rematch', switchTo: '@phpInSimpleState.blockDelimiter' },
		] );
		expect( shortcode[ 0 ] ).toEqual( [
			'<\\?((php)|=)?',
			{ token: '@rematch', switchTo: '@phpInSimpleState.shortcode' },
		] );
		expect( blockAttributes[ 0 ] ).toEqual( [
			'<\\?((php)|=)?',
			{
				token: '@rematch',
				switchTo: '@phpInEmbeddedState.blockAttributes.text/javascript',
				nextEmbedded: '@pop',
			},
		] );
	} );

	describe( 'blockName', () => {
		const blockName = new RegExp( `^${ extend( 'html' ).language.blockName }` );

		it.each( [
			'wp:paragraph -->',
			'wp:separator /-->',
			'wp:group {"tagName":"div"} -->',
			'wp:my-plugin/my-block -->',
			'wp:paragraph',
		] )( 'matches %s', ( text ) => {
			expect( text ).toMatch( blockName );
		} );

		it.each( [ 'wp:paragraph-->', 'wp:Paragraph -->', 'wp:paragraph text -->', 'wp:1block -->' ] )(
			'does not match %s',
			( text ) => {
				expect( text ).not.toMatch( blockName );
			}
		);
	} );
} );
