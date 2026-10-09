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

// `instanceof RegExp` fails for regular expressions created in another realm, e.g. the built-in
// definition loaded by monaco in the editor canvas iframe.
function isRegExp( value: unknown ): value is RegExp {
	return Object.prototype.toString.call( value ) === '[object RegExp]';
}

// The Monarch compiler detects rules with `instanceof RegExp`, which fails for the rules defined
// in this file when monaco is loaded in the editor canvas iframe. Convert all regular expressions
// into strings so that the definition can be compiled in any window.
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

// Extend the built-in HTML language definition to highlight WordPress-specific syntax:
// block delimiters (e.g. `<!-- wp:group {"layout":{"type":"constrained"}} -->`)
// and shortcodes (e.g. `[gallery ids="1,2,3"]`).
function extendHtmlLanguage(
	language: Monaco.languages.IMonarchLanguage
): Monaco.languages.IMonarchLanguage {
	const { root, ...states } = language.tokenizer;
	return serializeRegExps( {
		...language,
		blockName,
		tokenizer: {
			// The first state is the start state.
			root: [
				...wpRootRules,
				// Stop the text rule at `[` so that shortcodes in the middle of text are matched.
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
 * Replace the built-in HTML tokenizer with the one that also highlights WordPress-specific syntax.
 * This must be called before any HTML model is created.
 *
 * @param monaco The monaco instance.
 */
export default function registerWpHtmlTokenizer( monaco: typeof Monaco ) {
	const html: LanguageExtensionPoint | undefined = monaco.languages
		.getLanguages()
		.find( ( { id } ) => 'html' === id );
	const loader = html?.loader;

	// Keep the built-in tokenizer if its definition can't be loaded.
	if ( ! loader ) {
		return;
	}

	// Registering a factory synchronously disposes the built-in one, so it can't override
	// this tokenizer later even when the built-in definition is loaded asynchronously.
	monaco.languages.registerTokensProviderFactory( 'html', {
		create: async () => extendHtmlLanguage( ( await loader() ).language ),
	} );
}
