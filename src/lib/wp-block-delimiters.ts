/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';

/**
 * WordPress dependencies
 */
import { debounce } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';

type BlockDelimiter = {
	// Block name, e.g. `wp:paragraph`.
	name: string;
	nameRange: Monaco.IRange;
	// Offsets of the whole delimiter.
	start: number;
	end: number;
};

// Same as the tokenizer of `@wordpress/block-serialization-default-parser`.
const delimiterPattern =
	/<!--\s+(\/)?wp:([a-z][a-z0-9_-]*\/)?([a-z][a-z0-9_-]*)\s+({(?:(?=([^}]+|}+(?=})|(?!}\s+\/?-->)[^])*)\5|[^]*?)}\s+)?(\/)?-->/g;

const languageIds = [ 'html', 'php' ];

/**
 * Find block delimiters and pair opening and closing ones with the same block name, as HTML tags
 * are paired. Void delimiters, e.g. `<!-- wp:separator /-->`, are skipped. In PHP, delimiters in
 * PHP code are skipped since they may be built dynamically.
 *
 * @param model The model.
 */
function parseBlockDelimiters( model: Monaco.editor.ITextModel ) {
	let text = model.getValue();
	if ( 'php' === model.getLanguageId() ) {
		// Replace PHP code with whitespace to keep the offsets.
		text = text.replace( /<\?(?:php|=)?[\s\S]*?(?:\?>|$)/g, ( code ) =>
			code.replace( /[^\r\n]/g, ' ' )
		);
	}

	const pairs: [ BlockDelimiter, BlockDelimiter ][] = [];
	const unclosed: BlockDelimiter[] = [];
	const unopened: BlockDelimiter[] = [];
	const openers: { key: string; delimiter: BlockDelimiter }[] = [];

	for ( const match of text.matchAll( delimiterPattern ) ) {
		const [ delimiterText, isCloser, namespace = '', blockName, , , isVoid ] = match;
		if ( isVoid ) {
			continue;
		}

		const name = `wp:${ namespace }${ blockName }`;
		const { lineNumber, column } = model.getPositionAt(
			match.index + delimiterText.indexOf( 'wp:' )
		);
		const delimiter = {
			name,
			nameRange: {
				startLineNumber: lineNumber,
				startColumn: column,
				endLineNumber: lineNumber,
				endColumn: column + name.length,
			},
			start: match.index,
			end: match.index + delimiterText.length,
		};
		// `wp:paragraph` and `wp:core/paragraph` are the same block.
		const key = `${ namespace || 'core/' }${ blockName }`;

		if ( ! isCloser ) {
			openers.push( { key, delimiter } );
			continue;
		}

		const index = openers.findLastIndex( ( opener ) => key === opener.key );
		if ( index < 0 ) {
			unopened.push( delimiter );
			continue;
		}
		const [ opener, ...innerOpeners ] = openers.splice( index );
		pairs.push( [ opener.delimiter, delimiter ] );
		unclosed.push( ...innerOpeners.map( ( item ) => item.delimiter ) );
	}
	unclosed.push( ...openers.map( ( item ) => item.delimiter ) );

	return { pairs, unclosed, unopened };
}

/**
 * Show warnings for unclosed blocks and closing delimiters without a matching opening delimiter.
 *
 * @param monaco The monaco instance.
 * @param model  The model.
 */
function updateMarkers( monaco: typeof Monaco, model: Monaco.editor.ITextModel ) {
	const owner = 'custom-html-block-extension';
	if ( ! languageIds.includes( model.getLanguageId() ) ) {
		monaco.editor.setModelMarkers( model, owner, [] );
		return;
	}

	const { unclosed, unopened } = parseBlockDelimiters( model );
	monaco.editor.setModelMarkers( model, owner, [
		...unclosed.map( ( { name, nameRange } ) => ( {
			...nameRange,
			severity: monaco.MarkerSeverity.Warning,
			message: sprintf(
				/* translators: %s: Block name, e.g. wp:paragraph. */
				__( 'Block "%s" is not closed.', 'custom-html-block-extension' ),
				name
			),
		} ) ),
		...unopened.map( ( { name, nameRange } ) => ( {
			...nameRange,
			severity: monaco.MarkerSeverity.Warning,
			message: sprintf(
				/* translators: %s: Block name, e.g. wp:paragraph. */
				__( 'Block "%s" is closed without being opened.', 'custom-html-block-extension' ),
				name
			),
		} ) ),
	] );
}

/**
 * Highlight the block names of the opening and closing delimiters of a block like matching
 * brackets when the cursor is on either of them.
 *
 * @param monaco The monaco instance.
 * @param editor The editor.
 */
function highlightMatchingPair( monaco: typeof Monaco, editor: Monaco.editor.ICodeEditor ) {
	const decorations = editor.createDecorationsCollection();
	const update = () => {
		const model = editor.getModel();
		const position = editor.getPosition();
		if (
			! model ||
			! position ||
			! languageIds.includes( model.getLanguageId() ) ||
			'never' === editor.getOption( monaco.editor.EditorOption.matchBrackets )
		) {
			decorations.clear();
			return;
		}

		const offset = model.getOffsetAt( position );
		const pair = parseBlockDelimiters( model ).pairs.find( ( delimiters ) =>
			delimiters.some( ( { start, end } ) => start <= offset && offset <= end )
		);
		decorations.set(
			pair?.map( ( { nameRange } ) => ( {
				range: nameRange,
				options: { className: 'bracket-match' },
			} ) ) ?? []
		);
	};

	editor.onDidChangeCursorPosition( update );
	editor.onDidChangeModel( update );
}

/**
 * Highlight matching block delimiters and show warnings for unpaired ones in HTML and PHP models.
 *
 * @param monaco The monaco instance.
 */
export default function registerWpBlockDelimiters( monaco: typeof Monaco ) {
	monaco.editor.onDidCreateEditor( ( editor ) => highlightMatchingPair( monaco, editor ) );

	monaco.editor.onDidCreateModel( ( model ) => {
		const debouncedUpdateMarkers = debounce( () => updateMarkers( monaco, model ), 500 );
		updateMarkers( monaco, model );
		model.onDidChangeContent( debouncedUpdateMarkers );
		model.onDidChangeLanguage( () => updateMarkers( monaco, model ) );
		model.onWillDispose( () => debouncedUpdateMarkers.cancel() );
	} );
}
