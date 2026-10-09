/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

// `loader` lazily loads the built-in language definition. monaco registers it to every
// built-in language, but it isn't included in the public type definitions.
type LanguageExtensionPoint = Monaco.languages.ILanguageExtensionPoint & {
	loader?: () => Promise< { language: Monaco.languages.IMonarchLanguage } >;
};

// WordPress block name, e.g. `wp:paragraph`, `wp:my-plugin/my-block`. It must be followed by
// attributes or the end of the delimiter, otherwise the comment isn't a block delimiter.
const blockName = /wp:(?:[a-z][a-z0-9_-]*\/)?[a-z][a-z0-9_-]*(?=\s+(?:\{|\/?-->)|\s*$)/;

// Start of PHP code, where the built-in PHP definition switches from HTML to PHP.
const phpStart = /<\?((php)|=)?/;

/**
 * Create the rules for block delimiters and shortcodes. In PHP, tokens get the `.html` postfix and
 * each state switches to PHP code at `<?php`, as in the built-in definition.
 *
 * @param languageId The language ID.
 */
function createWpRules( languageId: 'html' | 'php' ) {
	const isPhp = 'php' === languageId;
	const postfix = isPhp ? '.html' : '';
	const switchToPhp = ( state: string ) =>
		isPhp ? [ [ phpStart, { token: '@rematch', switchTo: `@phpInSimpleState.${ state }` } ] ] : [];

	// Use `type` for block names and `keyword.flow` for shortcode names, which have colors different
	// from tag names in the built-in themes.
	const rootRules = [
		[
			/(<!--)(\s+)(@blockName)/,
			[ `delimiter${ postfix }`, '', { token: `type${ postfix }`, next: '@blockDelimiter' } ],
		],
		[
			/(<!--)(\s+)(\/)(@blockName)/,
			[
				`delimiter${ postfix }`,
				'',
				`delimiter${ postfix }`,
				{ token: `type${ postfix }`, next: '@blockDelimiter' },
			],
		],
		[
			/(\[\/?)([a-z_][\w\-]*)/,
			[ `delimiter${ postfix }`, { token: `keyword.flow${ postfix }`, next: '@shortcode' } ],
		],
	];

	const states = {
		// After <!-- wp:name or <!-- /wp:name
		blockDelimiter: [
			...switchToPhp( 'blockDelimiter' ),
			[ /\/?-->/, `delimiter${ postfix }`, '@pop' ],
			[
				/\{/,
				{
					token: '@rematch',
					next: '@blockAttributes',
					nextEmbedded: 'text/javascript',
				},
			],
			[ /[ \t\r\n]+/ ], // whitespace
		],

		// Block attributes as a JSON object. The serializer escapes `--` in the JSON,
		// so `-->` always closes the block delimiter.
		blockAttributes: [
			...( isPhp
				? [
						[
							phpStart,
							{
								token: '@rematch',
								switchTo: '@phpInEmbeddedState.blockAttributes.text/javascript',
								nextEmbedded: '@pop',
							},
						],
					]
				: [] ),
			[ /\/?-->/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' } ],
		],

		// After [name or [/name
		shortcode: [
			...switchToPhp( 'shortcode' ),
			[ /\/?\]/, `delimiter${ postfix }`, '@pop' ],
			[ /"([^"]*)"/, `attribute.value${ postfix }` ],
			[ /'([^']*)'/, `attribute.value${ postfix }` ],
			[ /[\w\-]+/, `attribute.name${ postfix }` ],
			[ /=/, `delimiter${ postfix }` ],
			[ /[ \t\r\n]+/ ], // whitespace
			[ /</, { token: '@rematch', next: '@pop' } ], // cover unclosed e.g. [name <p>
		],
	};

	return { rootRules, states };
}

/**
 * Check if the value is a regular expression, including one created in another window, e.g. the
 * built-in definition loaded by monaco in the editor canvas iframe.
 *
 * @param value The value to check.
 */
function isRegExp( value: unknown ): value is RegExp {
	return Object.prototype.toString.call( value ) === '[object RegExp]';
}

/**
 * Convert all regular expressions into strings, since the Monarch compiler rejects `RegExp`
 * objects created in another window, e.g. when monaco runs in the editor canvas iframe.
 *
 * @param value The value to convert.
 */
function serializeRegExps( value: unknown ): unknown {
	if ( isRegExp( value ) ) {
		return value.source;
	}
	if ( Array.isArray( value ) ) {
		return value.map( serializeRegExps );
	}
	if ( value && typeof value === 'object' ) {
		return Object.fromEntries(
			Object.entries( value ).map( ( [ key, item ] ) => [ key, serializeRegExps( item ) ] )
		);
	}
	return value;
}

/**
 * Extend the built-in HTML or PHP language definition with block delimiters and shortcodes. `root`
 * is kept first as the start state, and its text rule stops at `[` to match shortcodes within text.
 *
 * @param language   The built-in language definition.
 * @param languageId The language ID.
 */
function extendLanguage(
	language: Monaco.languages.IMonarchLanguage,
	languageId: 'html' | 'php'
): Monaco.languages.IMonarchLanguage {
	const { rootRules, states: wpStates } = createWpRules( languageId );
	const { root, ...states } = language.tokenizer;
	return serializeRegExps( {
		...language,
		blockName,
		tokenizer: {
			root: [
				...rootRules,
				...root.map( ( rule ) =>
					Array.isArray( rule ) && isRegExp( rule[ 0 ] ) && rule[ 0 ].source === '[^<]+'
						? [ /[^<\[]+/ ]
						: rule
				),
				[ /\[/ ],
			],
			...states,
			...wpStates,
		},
	} ) as Monaco.languages.IMonarchLanguage;
}

/**
 * Replace the built-in HTML and PHP tokenizer factories with ones that also highlight
 * WordPress-specific syntax. Must be called before any HTML or PHP model is created. Does nothing
 * for a language whose built-in definition can't be loaded. `<!--` and `-->` of block delimiters
 * aren't colorized as bracket pairs to keep them as subtle as other HTML delimiters.
 *
 * @param monaco The monaco instance.
 */
export default function registerWpHtmlTokenizer( monaco: typeof Monaco ) {
	for ( const languageId of [ 'html', 'php' ] as const ) {
		const language: LanguageExtensionPoint | undefined = monaco.languages
			.getLanguages()
			.find( ( { id } ) => languageId === id );
		const loader = language?.loader;

		if ( loader ) {
			monaco.languages.registerTokensProviderFactory( languageId, {
				create: async () => extendLanguage( ( await loader() ).language, languageId ),
			} );
		}
	}

	monaco.languages.setLanguageConfiguration( 'html', {
		colorizedBracketPairs: [
			[ '{', '}' ],
			[ '(', ')' ],
		],
	} );
}
