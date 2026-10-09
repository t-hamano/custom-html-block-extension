/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * Monarch tokenizer for HTML, extended to highlight WordPress-specific syntax:
 * block delimiters (e.g. `<!-- wp:group {"layout":{"type":"constrained"}} -->`)
 * and shortcodes (e.g. `[gallery ids="1,2,3"]`).
 *
 * Copied from the built-in HTML tokenizer of monaco-editor 0.57.0 (MIT License).
 * When updating monaco-editor, keep the non-WordPress parts in sync with upstream.
 *
 * @see https://github.com/microsoft/monaco-editor/blob/v0.57.0/src/languages/definitions/html/html.ts
 */
const language = {
	defaultToken: '',
	tokenPostfix: '.html',
	ignoreCase: true,

	// WordPress block name, e.g. `wp:paragraph`, `wp:my-plugin/my-block`. It must be followed by
	// attributes or the end of the delimiter, otherwise the comment isn't a block delimiter.
	blockName: /wp:(?:[a-z][a-z0-9_-]*\/)?[a-z][a-z0-9_-]*(?=\s+(?:\{|\/?-->)|\s*$)/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			[ /<!DOCTYPE/, 'metatag', '@doctype' ],
			[ /(<!--)(\s+)(@blockName)/, [ 'delimiter', '', { token: 'tag', next: '@blockDelimiter' } ] ],
			[
				/(<!--)(\s+)(\/)(@blockName)/,
				[ 'delimiter', '', 'delimiter', { token: 'tag', next: '@blockDelimiter' } ],
			],
			[ /<!--/, 'comment', '@comment' ],
			[ /(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/, [ 'delimiter', 'tag', '', 'delimiter' ] ],
			[ /(<)(script)/, [ 'delimiter', { token: 'tag', next: '@script' } ] ],
			[ /(<)(style)/, [ 'delimiter', { token: 'tag', next: '@style' } ] ],
			[ /(<)((?:[\w\-]+:)?[\w\-]+)/, [ 'delimiter', { token: 'tag', next: '@otherTag' } ] ],
			[ /(<\/)((?:[\w\-]+:)?[\w\-]+)/, [ 'delimiter', { token: 'tag', next: '@otherTag' } ] ],
			[ /(\[\/?)([a-z_][\w\-]*)/, [ 'delimiter', { token: 'tag', next: '@shortcode' } ] ],
			[ /</, 'delimiter' ],
			[ /\[/ ],
			[ /[^<\[]+/ ], // text
		],

		doctype: [
			[ /[^>]+/, 'metatag.content' ],
			[ />/, 'metatag', '@pop' ],
		],

		comment: [
			[ /-->/, 'comment', '@pop' ],
			[ /[^-]+/, 'comment.content' ],
			[ /./, 'comment.content' ],
		],

		otherTag: [
			[ /\/?>/, 'delimiter', '@pop' ],
			[ /"([^"]*)"/, 'attribute.value' ],
			[ /'([^']*)'/, 'attribute.value' ],
			[ /[\w\-]+/, 'attribute.name' ],
			[ /=/, 'delimiter' ],
			[ /[ \t\r\n]+/ ], // whitespace
		],

		// -- BEGIN WordPress block delimiters handling

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

		// -- END WordPress block delimiters handling

		// -- BEGIN WordPress shortcodes handling

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

		// -- END WordPress shortcodes handling

		// -- BEGIN <script> tags handling

		// After <script
		script: [
			[ /type/, 'attribute.name', '@scriptAfterType' ],
			[ /"([^"]*)"/, 'attribute.value' ],
			[ /'([^']*)'/, 'attribute.value' ],
			[ /[\w\-]+/, 'attribute.name' ],
			[ /=/, 'delimiter' ],
			[
				/>/,
				{
					token: 'delimiter',
					next: '@scriptEmbedded',
					nextEmbedded: 'text/javascript',
				},
			],
			[ /[ \t\r\n]+/ ], // whitespace
			[ /(<\/)(script\s*)(>)/, [ 'delimiter', 'tag', { token: 'delimiter', next: '@pop' } ] ],
		],

		// After <script ... type
		scriptAfterType: [
			[ /=/, 'delimiter', '@scriptAfterTypeEquals' ],
			[
				/>/,
				{
					token: 'delimiter',
					next: '@scriptEmbedded',
					nextEmbedded: 'text/javascript',
				},
			], // cover invalid e.g. <script type>
			[ /[ \t\r\n]+/ ], // whitespace
			[ /<\/script\s*>/, { token: '@rematch', next: '@pop' } ],
		],

		// After <script ... type =
		scriptAfterTypeEquals: [
			[
				/"module"/,
				{
					token: 'attribute.value',
					switchTo: '@scriptWithCustomType.text/javascript',
				},
			],
			[
				/'module'/,
				{
					token: 'attribute.value',
					switchTo: '@scriptWithCustomType.text/javascript',
				},
			],
			[
				/"([^"]*)"/,
				{
					token: 'attribute.value',
					switchTo: '@scriptWithCustomType.$1',
				},
			],
			[
				/'([^']*)'/,
				{
					token: 'attribute.value',
					switchTo: '@scriptWithCustomType.$1',
				},
			],
			[
				/>/,
				{
					token: 'delimiter',
					next: '@scriptEmbedded',
					nextEmbedded: 'text/javascript',
				},
			], // cover invalid e.g. <script type=>
			[ /[ \t\r\n]+/ ], // whitespace
			[ /<\/script\s*>/, { token: '@rematch', next: '@pop' } ],
		],

		// After <script ... type = $S2
		scriptWithCustomType: [
			[
				/>/,
				{
					token: 'delimiter',
					next: '@scriptEmbedded.$S2',
					nextEmbedded: '$S2',
				},
			],
			[ /"([^"]*)"/, 'attribute.value' ],
			[ /'([^']*)'/, 'attribute.value' ],
			[ /[\w\-]+/, 'attribute.name' ],
			[ /=/, 'delimiter' ],
			[ /[ \t\r\n]+/ ], // whitespace
			[ /<\/script\s*>/, { token: '@rematch', next: '@pop' } ],
		],

		scriptEmbedded: [
			[ /<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' } ],
			[ /[^<]+/, '' ],
		],

		// -- END <script> tags handling

		// -- BEGIN <style> tags handling

		// After <style
		style: [
			[ /type/, 'attribute.name', '@styleAfterType' ],
			[ /"([^"]*)"/, 'attribute.value' ],
			[ /'([^']*)'/, 'attribute.value' ],
			[ /[\w\-]+/, 'attribute.name' ],
			[ /=/, 'delimiter' ],
			[
				/>/,
				{
					token: 'delimiter',
					next: '@styleEmbedded',
					nextEmbedded: 'text/css',
				},
			],
			[ /[ \t\r\n]+/ ], // whitespace
			[ /(<\/)(style\s*)(>)/, [ 'delimiter', 'tag', { token: 'delimiter', next: '@pop' } ] ],
		],

		// After <style ... type
		styleAfterType: [
			[ /=/, 'delimiter', '@styleAfterTypeEquals' ],
			[
				/>/,
				{
					token: 'delimiter',
					next: '@styleEmbedded',
					nextEmbedded: 'text/css',
				},
			], // cover invalid e.g. <style type>
			[ /[ \t\r\n]+/ ], // whitespace
			[ /<\/style\s*>/, { token: '@rematch', next: '@pop' } ],
		],

		// After <style ... type =
		styleAfterTypeEquals: [
			[
				/"([^"]*)"/,
				{
					token: 'attribute.value',
					switchTo: '@styleWithCustomType.$1',
				},
			],
			[
				/'([^']*)'/,
				{
					token: 'attribute.value',
					switchTo: '@styleWithCustomType.$1',
				},
			],
			[
				/>/,
				{
					token: 'delimiter',
					next: '@styleEmbedded',
					nextEmbedded: 'text/css',
				},
			], // cover invalid e.g. <style type=>
			[ /[ \t\r\n]+/ ], // whitespace
			[ /<\/style\s*>/, { token: '@rematch', next: '@pop' } ],
		],

		// After <style ... type = $S2
		styleWithCustomType: [
			[
				/>/,
				{
					token: 'delimiter',
					next: '@styleEmbedded.$S2',
					nextEmbedded: '$S2',
				},
			],
			[ /"([^"]*)"/, 'attribute.value' ],
			[ /'([^']*)'/, 'attribute.value' ],
			[ /[\w\-]+/, 'attribute.name' ],
			[ /=/, 'delimiter' ],
			[ /[ \t\r\n]+/ ], // whitespace
			[ /<\/style\s*>/, { token: '@rematch', next: '@pop' } ],
		],

		styleEmbedded: [
			[ /<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' } ],
			[ /[^<]+/, '' ],
		],

		// -- END <style> tags handling
	},
};

// The Monarch compiler detects rules with `instanceof RegExp`, which fails for regular
// expressions created in another realm, e.g. when monaco is loaded in the editor canvas
// iframe. Convert them into strings so that the definition can be compiled in any window.
function serializeRegExps( value: unknown ): unknown {
	if ( value instanceof RegExp ) {
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
 * Override the built-in HTML tokenizer with the one that supports WordPress-specific syntax.
 * This must be called before any HTML model is created, otherwise the lazily loaded built-in
 * tokenizer may take precedence.
 *
 * @param monaco The monaco instance.
 */
export default function registerWpHtmlTokenizer( monaco: typeof Monaco ) {
	monaco.languages.setMonarchTokensProvider(
		'html',
		serializeRegExps( language ) as Monaco.languages.IMonarchLanguage
	);
}
