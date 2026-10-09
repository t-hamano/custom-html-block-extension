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

const wpRootRules = [
	[ /(<!--)(\s+)(@blockName)/, [ 'delimiter', '', { token: 'tag', next: '@blockDelimiter' } ] ],
	[
		/(<!--)(\s+)(\/)(@blockName)/,
		[ 'delimiter', '', 'delimiter', { token: 'tag', next: '@blockDelimiter' } ],
	],
	[ /(\[\/?)([a-z_][\w\-]*)/, [ 'delimiter', { token: 'tag', next: '@shortcode' } ] ],
];

const wpStates = {
	// After <!-- wp:name or <!-- /wp:name
	blockDelimiter: [
		[ /\/?-->/, 'delimiter', '@pop' ],
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
	blockAttributes: [ [ /\/?-->/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' } ] ],

	// After [name or [/name
	shortcode: [
		[ /\/?\]/, 'delimiter', '@pop' ],
		[ /"([^"]*)"/, 'attribute.value' ],
		[ /'([^']*)'/, 'attribute.value' ],
		[ /[\w\-]+/, 'attribute.name' ],
		[ /=/, 'delimiter' ],
		[ /[ \t\r\n]+/ ], // whitespace
		[ /</, { token: '@rematch', next: '@pop' } ], // cover unclosed e.g. [name <p>
	],
};

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
 * Extend the built-in HTML language definition with block delimiters and shortcodes. `root` is kept
 * first as the start state, and its text rule stops at `[` to match shortcodes within text.
 *
 * @param language The built-in HTML language definition.
 */
function extendHtmlLanguage(
	language: Monaco.languages.IMonarchLanguage
): Monaco.languages.IMonarchLanguage {
	const { root, ...states } = language.tokenizer;
	return serializeRegExps( {
		...language,
		blockName,
		tokenizer: {
			root: [
				...wpRootRules,
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
 * Replace the built-in HTML tokenizer factory with one that also highlights WordPress-specific
 * syntax. Must be called before any HTML model is created. Does nothing if the built-in
 * definition can't be loaded.
 *
 * @param monaco The monaco instance.
 */
export default function registerWpHtmlTokenizer( monaco: typeof Monaco ) {
	const html: LanguageExtensionPoint | undefined = monaco.languages
		.getLanguages()
		.find( ( { id } ) => 'html' === id );
	const loader = html?.loader;

	if ( ! loader ) {
		return;
	}

	monaco.languages.registerTokensProviderFactory( 'html', {
		create: async () => extendHtmlLanguage( ( await loader() ).language ),
	} );
}
