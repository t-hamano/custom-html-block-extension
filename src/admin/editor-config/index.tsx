/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from '@wordpress/element';
import { Card, CollapsibleCard, Stack, Text } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { useDebounce } from '@wordpress/compose';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../index';
import { updateSettings } from '../api';
import EditorPreview from './components/editor-preview';
import Filter, { type EditorMode } from './components/filter';
import Controls from './components/controls';
import * as EditorSettings from './editor-settings';
import * as EditorOptions from './editor-options';
import { isDeepEqual } from '../../lib/helper';
import type { EditorConfigContextType } from '../../types';

/**
 * Context
 */
export const EditorConfigContext = createContext< EditorConfigContextType >(
	{} as EditorConfigContextType
);

// Value for the `inert` attribute; the empty string enables it (React 18 form).
function inertValue( condition: boolean ): '' | undefined {
	return condition ? '' : undefined;
}

// Name of the CSS custom highlight for the words matching the search query.
const SEARCH_HIGHLIGHT_NAME = 'chbe-editor-config-search';

// Case-insensitive patterns for the words in the search query. Unlike
// lowercasing, the match offsets stay valid for the original text.
function getSearchPatterns( searchQuery: string ): RegExp[] {
	return searchQuery
		.split( /\s+/ )
		.filter( Boolean )
		.map( ( word ) => new RegExp( word.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ), 'giu' ) );
}

// Whether a setting with the given title matches the current search query.
// `parent` is the name of the group a nested setting belongs to (e.g.
// "Minimap"), so searching for the group still finds its settings.
export function useSearchVisibility( title: string, parent?: string ): boolean {
	const { searchQuery } = useContext( EditorConfigContext );
	const searchText = parent ? `${ parent } ${ title }` : title;
	return getSearchPatterns( searchQuery ).every(
		( pattern ) => searchText.search( pattern ) !== -1
	);
}

// Highlights the words matching the search query in the setting labels.
// The controls only accept a string label, so the CSS Custom Highlight API
// styles the matched text ranges.
function useSearchHighlight( searchQuery: string ) {
	const ref = useRef< HTMLDivElement >( null );

	useEffect( () => {
		const patterns = getSearchPatterns( searchQuery );
		if ( ! ref.current || ! patterns.length || ! ( 'highlights' in CSS ) ) {
			return;
		}

		const ranges: Range[] = [];
		ref.current
			.querySelectorAll(
				'.chbe-admin-editor-config__setting-item :is(label, .components-base-control__label)'
			)
			.forEach( ( label ) => {
				const walker = document.createTreeWalker( label, NodeFilter.SHOW_TEXT );
				while ( walker.nextNode() ) {
					const node = walker.currentNode;
					const text = node.textContent ?? '';
					patterns.forEach( ( pattern ) => {
						for ( const match of text.matchAll( pattern ) ) {
							const range = new Range();
							range.setStart( node, match.index );
							range.setEnd( node, match.index + match[ 0 ].length );
							ranges.push( range );
						}
					} );
				}
			} );

		CSS.highlights.set( SEARCH_HIGHLIGHT_NAME, new Highlight( ...ranges ) );

		return () => {
			CSS.highlights.delete( SEARCH_HIGHLIGHT_NAME );
		};
	}, [ searchQuery ] );

	return ref;
}

// Collapsible panel, forced open while a search query is active and otherwise
// toggled by the user.
function SettingsPanel( { title, children }: { title: string; children: ReactNode } ) {
	const { searchQuery } = useContext( EditorConfigContext );
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<CollapsibleCard.Root
			className="chbe-admin-editor-config__panel"
			open={ !! searchQuery || isOpen }
			onOpenChange={ setIsOpen }
		>
			<CollapsibleCard.Header render={ <h2 /> }>
				<Card.Title>{ title }</Card.Title>
			</CollapsibleCard.Header>
			<CollapsibleCard.Content>
				<Stack direction="column" gap="lg">
					{ children }
				</Stack>
			</CollapsibleCard.Content>
		</CollapsibleCard.Root>
	);
}

export default function EditorConfig() {
	const {
		isWaiting,
		editorSettings,
		editorOptions,
		savedEditorConfig,
		setIsWaiting,
		setEditorOptions,
		setEditorSettings,
		setSavedEditorConfig,
	} = useContext( AdminContext );

	const [ isEditorDisabled, setIsEditorDisabled ] = useState( false );
	const [ editorMode, setEditorMode ] = useState< EditorMode >( 'basic' );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const settingsRef = useSearchHighlight( searchQuery );
	const [ fontWeights, setFontWeights ] = useState( [ 300 ] );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	const isDirty =
		! isDeepEqual( editorSettings, savedEditorConfig.editorSettings ) ||
		! isDeepEqual( editorOptions, savedEditorConfig.editorOptions );

	// Update editor config.
	const onUpdateOptions = async () => {
		setIsWaiting( true );

		try {
			await updateSettings( { editorSettings, editorOptions } );
			setSavedEditorConfig( { editorSettings, editorOptions } );
			// Keep the spinner visible briefly so it does not flash on fast responses.
			await new Promise( ( resolve ) => setTimeout( resolve, 600 ) );
			createSuccessNotice( __( 'Settings saved.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
		} catch ( error ) {
			createErrorNotice( ( error as Error ).message, { type: 'snackbar' } );
		} finally {
			setIsWaiting( false );
		}
	};

	// Reset editor config.
	const onResetOptions = async () => {
		setIsWaiting( true );

		try {
			const response = await updateSettings( { editorSettings: null, editorOptions: null } );
			// Sets default editor config.
			setEditorSettings( response.editorSettings );
			setEditorOptions( response.editorOptions );
			setSavedEditorConfig( {
				editorSettings: response.editorSettings,
				editorOptions: response.editorOptions,
			} );
			// Keep the spinner visible briefly so it does not flash on fast responses.
			await new Promise( ( resolve ) => setTimeout( resolve, 600 ) );
			createSuccessNotice( __( 'Settings have been reset.', 'custom-html-block-extension' ), {
				type: 'snackbar',
			} );
		} catch ( error ) {
			createErrorNotice( ( error as Error ).message, { type: 'snackbar' } );
		} finally {
			setIsWaiting( false );
		}
	};

	// Refresh editor.
	// Memoized so consumers can derive stable (debounced) callbacks from it.
	const onRefreshEditor = useCallback( () => {
		// Some options are not reflected when the state is changed.
		// So disable the editor for a moment by Disabled component as a workaround.
		setIsEditorDisabled( true );
		setTimeout( () => {
			setIsEditorDisabled( false );
		}, 300 );
	}, [] );

	// Merge refreshes requested in quick succession, such as while dragging a
	// range control, into one.
	const debouncedRefreshEditor = useDebounce( onRefreshEditor, 100 );

	return (
		<Stack align="start" wrap="wrap" className="chbe-admin-editor-config" gap="xl">
			<Stack direction="column" className="chbe-admin-editor-config__preview" gap="lg">
				<Text variant="heading-lg" render={ <h2 /> }>
					{ __( 'Preview', 'custom-html-block-extension' ) }
				</Text>
				<EditorPreview isEditorDisabled={ isEditorDisabled } setFontWeights={ setFontWeights } />
				<Controls
					isWaiting={ isWaiting }
					isDirty={ isDirty }
					onUpdateOptions={ onUpdateOptions }
					onResetOptions={ onResetOptions }
				/>
			</Stack>
			<Stack direction="column" className="chbe-admin-editor-config__settings" gap="xl">
				<Filter
					editorMode={ editorMode }
					setEditorMode={ setEditorMode }
					searchQuery={ searchQuery }
					setSearchQuery={ setSearchQuery }
				/>
				<Stack
					ref={ settingsRef }
					direction="column"
					className={ clsx(
						editorMode === 'basic' && ! searchQuery
							? 'chbe-admin-editor-config__basic-settings'
							: 'chbe-admin-editor-config__advanced-settings',
						{ 'is-searching': !! searchQuery }
					) }
					gap={ editorMode === 'basic' && ! searchQuery ? 'xl' : 'sm' }
				>
					<EditorConfigContext.Provider
						value={ { onRefreshEditor: debouncedRefreshEditor, searchQuery, fontWeights } }
					>
						{ 'basic' === editorMode && ! searchQuery && (
							<>
								<EditorSettings.Theme />
								<EditorSettings.TabSize />
								<EditorSettings.InsertSpaces />
								<EditorSettings.DetectIndentation />
								<EditorSettings.Emmet />
								<EditorOptions.FontFamily />
								<EditorOptions.FontWeight />
								<EditorOptions.FontSize />
								<EditorOptions.LineHeight />
								<EditorOptions.WordWrap />
								<EditorOptions.LineNumbers />
								<EditorOptions.RenderWhitespace />
								<EditorOptions.MinimapEnabled />
								<EditorOptions.Folding />
								<EditorOptions.CursorStyle />
								<EditorOptions.AutoIndent />
								<EditorOptions.AutoClosingBrackets />
								<EditorOptions.AutoClosingQuotes />
								<EditorOptions.QuickSuggestions />
							</>
						) }
						{ ( 'advanced' === editorMode || searchQuery ) && (
							<>
								<SettingsPanel title={ __( 'Editor', 'custom-html-block-extension' ) }>
									<EditorSettings.Theme />
									<EditorSettings.TabSize />
									<EditorSettings.InsertSpaces />
									<EditorSettings.DetectIndentation />
									<EditorSettings.Emmet />
									<EditorOptions.Contextmenu />
									<EditorOptions.GlyphMargin />
									<EditorOptions.PaddingTop />
									<EditorOptions.PaddingBottom />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Font', 'custom-html-block-extension' ) }>
									<EditorOptions.FontFamily />
									<EditorOptions.FontWeight />
									<EditorOptions.FontLigatures />
									<EditorOptions.FontSize />
									<EditorOptions.LineHeight />
									<EditorOptions.LetterSpacing />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Word wrap', 'custom-html-block-extension' ) }>
									<EditorOptions.WordWrap />
									<div
										inert={ inertValue(
											'on' === editorOptions.wordWrap || 'off' === editorOptions.wordWrap
										) }
									>
										<EditorOptions.WordWrapColumn />
									</div>
									<div inert={ inertValue( 'off' === editorOptions.wordWrap ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.WrappingIndent />
											<EditorOptions.WordWrapIndicator />
										</Stack>
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Minimap', 'custom-html-block-extension' ) }>
									<EditorOptions.MinimapEnabled />
									<div inert={ inertValue( ! editorOptions.minimap.enabled ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.MinimapSide />
											<EditorOptions.MinimapMaxColumn />
											<EditorOptions.MinimapScale />
											<EditorOptions.MinimapAutohide />
											<EditorOptions.MinimapShowSlider />
											<EditorOptions.MinimapSize />
											<EditorOptions.MinimapRenderCharacters />
										</Stack>
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Cursor', 'custom-html-block-extension' ) }>
									<EditorOptions.CursorStyle />
									<div inert={ inertValue( 'line' !== editorOptions.cursorStyle ) }>
										<EditorOptions.CursorWidth />
									</div>
									<EditorOptions.CursorBlinking />
									<EditorOptions.CursorSurroundingLines />
									<EditorOptions.CursorSurroundingLinesStyle />
									<EditorOptions.CursorSmoothCaretAnimation />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Code folding', 'custom-html-block-extension' ) }>
									<EditorOptions.Folding />
									<div inert={ inertValue( ! editorOptions.folding ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.ShowFoldingControls />
											<EditorOptions.FoldingStrategy />
											<EditorOptions.LineDecorationsWidth />
											<EditorOptions.FoldingHighlight />
											<EditorOptions.UnfoldOnClickAfterEndOfLine />
										</Stack>
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Line number', 'custom-html-block-extension' ) }>
									<EditorOptions.LineNumbers />
									<div inert={ inertValue( 'off' === editorOptions.lineNumbers ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.LineNumbersMinChars />
											<EditorOptions.SelectOnLineNumbers />
											<EditorOptions.RenderFinalNewline />
										</Stack>
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Suggest', 'custom-html-block-extension' ) }>
									<EditorOptions.QuickSuggestions />
									<div inert={ inertValue( ! editorOptions.suggestOnTriggerCharacters ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.QuickSuggestionsTypes />
											<EditorOptions.AcceptSuggestionOnEnter />
											<EditorOptions.QuickSuggestionsDelay />
											<EditorOptions.SuggestFontSize />
											<EditorOptions.SuggestLineHeight />
											<EditorOptions.SuggestShowIcons />
											<EditorOptions.SuggestInsertMode />
											<EditorOptions.SuggestPreview />
										</Stack>
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Auto completion', 'custom-html-block-extension' ) }>
									<EditorOptions.AutoIndent />
									<EditorOptions.AutoClosingBrackets />
									<EditorOptions.AutoClosingQuotes />
									<EditorOptions.AutoClosingDelete />
									<EditorOptions.AutoClosingOvertype />
									<EditorOptions.AutoSurround />
									<EditorOptions.FormatOnPaste />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Mouse and scroll', 'custom-html-block-extension' ) }>
									<EditorOptions.MouseWheelScrollSensitivity />
									<EditorOptions.FastScrollSensitivity />
									<EditorOptions.Hover />
									<div inert={ inertValue( 'off' === editorOptions.hover.enabled ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.HoverDelay />
											<EditorOptions.HoverSticky />
											<EditorOptions.HoverAbove />
										</Stack>
									</div>
									<EditorOptions.SmoothScrolling />
									<EditorOptions.StickyScrollEnabled />
									<div inert={ inertValue( ! editorOptions.stickyScroll.enabled ) }>
										<EditorOptions.StickyScrollMaxLineCount />
									</div>
									<EditorOptions.ScrollBeyondLastLine />
									<EditorOptions.ScrollBeyondLastColumn />
									<EditorOptions.MouseWheelZoom />
									<EditorOptions.DragAndDrop />
									<EditorOptions.HideCursorInOverviewRuler />
									<EditorOptions.MultiCursorModifier />
								</SettingsPanel>
								<SettingsPanel
									title={ __( 'Select, cut, copy, and paste', 'custom-html-block-extension' ) }
								>
									<EditorOptions.EmptySelectionClipboard />
									<EditorOptions.RoundedSelection />
									<EditorOptions.SelectionHighlight />
									<EditorOptions.MultiCursorPaste />
									<EditorOptions.StickyTabStops />
									<EditorOptions.CopyWithSyntaxHighlighting />
									<EditorOptions.ColumnSelection />
								</SettingsPanel>
								<SettingsPanel
									title={ __( 'Highlight and rendering', 'custom-html-block-extension' ) }
								>
									<EditorOptions.MatchBrackets />
									<EditorOptions.BracketPairColorizationEnabled />
									<div inert={ inertValue( ! editorOptions.bracketPairColorization.enabled ) }>
										<EditorOptions.BracketPairColorizationIndependentColorPoolPerBracketType />
									</div>
									<EditorOptions.OccurrencesHighlight />
									<EditorOptions.RenderWhitespace />
									<EditorOptions.RenderLineHighlight />
									<div inert={ inertValue( 'none' === editorOptions.renderLineHighlight ) }>
										<EditorOptions.RenderLineHighlightOnlyWhenFocus />
									</div>
									<EditorOptions.GuidesIndentation />
									<div inert={ inertValue( ! editorOptions.guides.indentation ) }>
										<EditorOptions.GuidesHighlightActiveIndentation />
									</div>
									<EditorOptions.GuidesBracketPairs />
									<div inert={ inertValue( false === editorOptions.guides.bracketPairs ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.GuidesBracketPairsHorizontal />
											<EditorOptions.GuidesHighlightActiveBracketPair />
										</Stack>
									</div>
									<EditorOptions.RenderControlCharacters />
									<EditorOptions.UnicodeHighlightInvisibleCharacters />
									<EditorOptions.UnicodeHighlightAmbiguousCharacters />
									<EditorOptions.UnicodeHighlightNonBasicAscii />
									<EditorOptions.Rulers />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Find', 'custom-html-block-extension' ) }>
									<EditorOptions.FindAddExtraSpaceOnTop />
									<EditorOptions.FindSeedSearchStringFromSelection />
									<EditorOptions.FindLoop />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Scrollbar', 'custom-html-block-extension' ) }>
									<EditorOptions.ScrollbarUseShadows />
									<EditorOptions.OverviewRulerBorder />
									<EditorOptions.ScrollbarAlwaysConsumeMouseWheel />
									<EditorOptions.ScrollbarScrollByPage />
									<EditorOptions.ScrollbarHorizontal />
									<div inert={ inertValue( 'hidden' === editorOptions.scrollbar.horizontal ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.ScrollbarHorizontalHasArrows />
											<EditorOptions.ScrollbarHorizontalScrollbarSize />
										</Stack>
									</div>
									<EditorOptions.ScrollbarVertical />
									<div inert={ inertValue( 'hidden' === editorOptions.scrollbar.vertical ) }>
										<Stack direction="column" gap="lg">
											<EditorOptions.ScrollbarVerticalHasArrows />
											<EditorOptions.ScrollbarVerticalScrollbarSize />
										</Stack>
									</div>
									<div
										// Disabled unless a visible scrollbar has arrows.
										inert={ inertValue(
											! (
												( 'hidden' !== editorOptions.scrollbar.horizontal &&
													editorOptions.scrollbar.horizontalHasArrows ) ||
												( 'hidden' !== editorOptions.scrollbar.vertical &&
													editorOptions.scrollbar.verticalHasArrows )
											)
										) }
									>
										<EditorOptions.ScrollbarArrowSize />
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Other', 'custom-html-block-extension' ) }>
									<EditorOptions.UseTabStops />
									<EditorOptions.CommentsInsertSpace />
									<EditorOptions.Links />
								</SettingsPanel>
							</>
						) }
					</EditorConfigContext.Provider>
				</Stack>
			</Stack>
		</Stack>
	);
}
