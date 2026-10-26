/**
 * External dependencies
 */
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
import { Stack, Text } from '@wordpress/ui';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../index';
import { updateSettings } from '../api';
import EditorPreview from './components/editor-preview';
import Filter, { type EditorMode } from './components/filter';
import Controls from './components/controls';
import SettingsPanel, { SettingsPanelContext } from './components/settings-panel';
import SettingGroup from './components/setting-group';
import * as EditorSettings from './editor-settings';
import * as EditorOptions from './editor-options';
import { isDeepEqual, useWaitForSpinner } from '../../lib/helper';
import type { EditorConfigContextType } from '../../types';

/**
 * Context
 */
export const EditorConfigContext = createContext< EditorConfigContextType >(
	{} as EditorConfigContextType
);

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
// The panel title and the setting key are also matched, so searching for a
// panel or an option group such as "Guides" finds all of its settings.
export function useSearchVisibility( title: string, name: string ): boolean {
	const { searchQuery } = useContext( EditorConfigContext );
	const panelTitle = useContext( SettingsPanelContext );
	const searchText = [ panelTitle, title, name ].filter( Boolean ).join( ' ' );
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
	const waitForSpinner = useWaitForSpinner();

	const isDirty =
		! isDeepEqual( editorSettings, savedEditorConfig.editorSettings ) ||
		! isDeepEqual( editorOptions, savedEditorConfig.editorOptions );

	// Update editor config.
	const onUpdateOptions = async () => {
		setIsWaiting( true );

		try {
			await updateSettings( { editorSettings, editorOptions } );
			setSavedEditorConfig( { editorSettings, editorOptions } );
			if ( ! ( await waitForSpinner() ) ) {
				return;
			}
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
			if ( ! ( await waitForSpinner() ) ) {
				return;
			}
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
	}, [] );

	useEffect( () => {
		if ( ! isEditorDisabled ) {
			return;
		}
		const timeoutId = setTimeout( () => {
			setIsEditorDisabled( false );
		}, 300 );
		return () => clearTimeout( timeoutId );
	}, [ isEditorDisabled ] );

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
					<EditorConfigContext.Provider value={ { onRefreshEditor, searchQuery } }>
						{ 'basic' === editorMode && ! searchQuery && (
							<>
								<EditorSettings.Theme />
								<EditorSettings.Emmet />
								<EditorOptions.FontFamily />
								<EditorOptions.FontWeight fontWeights={ fontWeights } />
								<EditorOptions.FontSize />
								<EditorOptions.LineHeight />
								<EditorSettings.TabSize />
								<EditorSettings.InsertSpaces />
								<EditorSettings.DetectIndentation />
								<EditorOptions.AutoIndent />
								<EditorOptions.WordWrap />
								<EditorOptions.LineNumbers />
								<EditorOptions.MinimapEnabled />
								<EditorOptions.CursorStyle />
								<EditorOptions.QuickSuggestions />
								<EditorOptions.AutoClosingBrackets />
								<EditorOptions.AutoClosingQuotes />
								<EditorOptions.Folding />
								<EditorOptions.RenderWhitespace />
							</>
						) }
						{ ( 'advanced' === editorMode || searchQuery ) && (
							<>
								<SettingsPanel title={ __( 'General', 'custom-html-block-extension' ) }>
									<EditorSettings.Theme />
									<EditorSettings.Emmet />
									<EditorOptions.Contextmenu />
									<EditorOptions.Links />
									<EditorOptions.DragAndDrop />
									<EditorOptions.MouseWheelZoom />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Font', 'custom-html-block-extension' ) }>
									<EditorOptions.FontFamily />
									<EditorOptions.FontWeight fontWeights={ fontWeights } />
									<EditorOptions.FontLigatures />
									<EditorOptions.FontSize />
									<EditorOptions.LineHeight />
									<EditorOptions.LetterSpacing />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Indentation', 'custom-html-block-extension' ) }>
									<EditorSettings.TabSize />
									<EditorSettings.InsertSpaces />
									<EditorSettings.DetectIndentation />
									<EditorOptions.AutoIndent />
									<EditorOptions.UseTabStops />
									<EditorOptions.StickyTabStops />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Word wrap', 'custom-html-block-extension' ) }>
									<EditorOptions.WordWrap />
									<SettingGroup
										isDisabled={
											'on' === editorOptions.wordWrap || 'off' === editorOptions.wordWrap
										}
									>
										<EditorOptions.WordWrapColumn />
									</SettingGroup>
									<SettingGroup isDisabled={ 'off' === editorOptions.wordWrap }>
										<Stack direction="column" gap="lg">
											<EditorOptions.WrappingIndent />
											<EditorOptions.WordWrapIndicator />
										</Stack>
									</SettingGroup>
								</SettingsPanel>
								<SettingsPanel
									title={ __( 'Line numbers and gutter', 'custom-html-block-extension' ) }
								>
									<EditorOptions.LineNumbers />
									<SettingGroup isDisabled={ 'off' === editorOptions.lineNumbers }>
										<Stack direction="column" gap="lg">
											<EditorOptions.LineNumbersMinChars />
											<EditorOptions.SelectOnLineNumbers />
											<EditorOptions.RenderFinalNewline />
										</Stack>
									</SettingGroup>
									<EditorOptions.GlyphMargin />
									<EditorOptions.LineDecorationsWidth />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Layout', 'custom-html-block-extension' ) }>
									<EditorOptions.PaddingTop />
									<EditorOptions.PaddingBottom />
									<EditorOptions.ScrollBeyondLastLine />
									<EditorOptions.ScrollBeyondLastColumn />
									<EditorOptions.Rulers />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Minimap', 'custom-html-block-extension' ) }>
									<EditorOptions.MinimapEnabled />
									<SettingGroup isDisabled={ ! editorOptions.minimap.enabled }>
										<Stack direction="column" gap="lg">
											<EditorOptions.MinimapSide />
											<EditorOptions.MinimapMaxColumn />
											<EditorOptions.MinimapScale />
											<EditorOptions.MinimapAutohide />
											<EditorOptions.MinimapShowSlider />
											<EditorOptions.MinimapSize />
											<EditorOptions.MinimapRenderCharacters />
										</Stack>
									</SettingGroup>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Cursor', 'custom-html-block-extension' ) }>
									<EditorOptions.CursorStyle />
									<SettingGroup isDisabled={ 'line' !== editorOptions.cursorStyle }>
										<EditorOptions.CursorWidth />
									</SettingGroup>
									<EditorOptions.CursorBlinking />
									<EditorOptions.CursorSurroundingLines />
									<EditorOptions.CursorSurroundingLinesStyle />
									<EditorOptions.CursorSmoothCaretAnimation />
									<EditorOptions.MultiCursorModifier />
									<EditorOptions.MultiCursorPaste />
									<EditorOptions.ColumnSelection />
								</SettingsPanel>
								<SettingsPanel
									title={ __( 'Selection and clipboard', 'custom-html-block-extension' ) }
								>
									<EditorOptions.EmptySelectionClipboard />
									<EditorOptions.CopyWithSyntaxHighlighting />
									<EditorOptions.RoundedSelection />
									<EditorOptions.SelectionHighlight />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Suggestions', 'custom-html-block-extension' ) }>
									<EditorOptions.QuickSuggestions />
									<SettingGroup isDisabled={ ! editorOptions.suggestOnTriggerCharacters }>
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
									</SettingGroup>
								</SettingsPanel>
								<SettingsPanel
									title={ __( 'Auto closing and formatting', 'custom-html-block-extension' ) }
								>
									<EditorOptions.AutoClosingBrackets />
									<EditorOptions.AutoClosingQuotes />
									<EditorOptions.AutoClosingDelete />
									<EditorOptions.AutoClosingOvertype />
									<EditorOptions.AutoSurround />
									<EditorOptions.FormatOnPaste />
									<EditorOptions.CommentsInsertSpace />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Code folding', 'custom-html-block-extension' ) }>
									<EditorOptions.Folding />
									<SettingGroup isDisabled={ ! editorOptions.folding }>
										<Stack direction="column" gap="lg">
											<EditorOptions.ShowFoldingControls />
											<EditorOptions.FoldingStrategy />
											<EditorOptions.FoldingHighlight />
											<EditorOptions.UnfoldOnClickAfterEndOfLine />
										</Stack>
									</SettingGroup>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Brackets and guides', 'custom-html-block-extension' ) }>
									<EditorOptions.MatchBrackets />
									<EditorOptions.BracketPairColorizationEnabled />
									<SettingGroup isDisabled={ ! editorOptions.bracketPairColorization.enabled }>
										<EditorOptions.BracketPairColorizationIndependentColorPoolPerBracketType />
									</SettingGroup>
									<EditorOptions.GuidesIndentation />
									<SettingGroup isDisabled={ ! editorOptions.guides.indentation }>
										<EditorOptions.GuidesHighlightActiveIndentation />
									</SettingGroup>
									<EditorOptions.GuidesBracketPairs />
									<SettingGroup isDisabled={ false === editorOptions.guides.bracketPairs }>
										<Stack direction="column" gap="lg">
											<EditorOptions.GuidesBracketPairsHorizontal />
											<EditorOptions.GuidesHighlightActiveBracketPair />
										</Stack>
									</SettingGroup>
								</SettingsPanel>
								<SettingsPanel
									title={ __( 'Highlighting and whitespace', 'custom-html-block-extension' ) }
								>
									<EditorOptions.RenderLineHighlight />
									<SettingGroup isDisabled={ 'none' === editorOptions.renderLineHighlight }>
										<EditorOptions.RenderLineHighlightOnlyWhenFocus />
									</SettingGroup>
									<EditorOptions.OccurrencesHighlight />
									<EditorOptions.RenderWhitespace />
									<EditorOptions.RenderControlCharacters />
									<EditorOptions.UnicodeHighlightInvisibleCharacters />
									<EditorOptions.UnicodeHighlightAmbiguousCharacters />
									<EditorOptions.UnicodeHighlightNonBasicAscii />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Hover', 'custom-html-block-extension' ) }>
									<EditorOptions.Hover />
									<SettingGroup isDisabled={ 'off' === editorOptions.hover.enabled }>
										<Stack direction="column" gap="lg">
											<EditorOptions.HoverDelay />
											<EditorOptions.HoverSticky />
											<EditorOptions.HoverAbove />
										</Stack>
									</SettingGroup>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Find', 'custom-html-block-extension' ) }>
									<EditorOptions.FindAddExtraSpaceOnTop />
									<EditorOptions.FindSeedSearchStringFromSelection />
									<EditorOptions.FindLoop />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Scrolling', 'custom-html-block-extension' ) }>
									<EditorOptions.MouseWheelScrollSensitivity />
									<EditorOptions.FastScrollSensitivity />
									<EditorOptions.SmoothScrolling />
									<EditorOptions.StickyScrollEnabled />
									<SettingGroup isDisabled={ ! editorOptions.stickyScroll.enabled }>
										<EditorOptions.StickyScrollMaxLineCount />
									</SettingGroup>
								</SettingsPanel>
								<SettingsPanel
									title={ __( 'Scrollbar and overview ruler', 'custom-html-block-extension' ) }
								>
									<EditorOptions.ScrollbarUseShadows />
									<EditorOptions.ScrollbarAlwaysConsumeMouseWheel />
									<EditorOptions.ScrollbarScrollByPage />
									<EditorOptions.ScrollbarHorizontal />
									<SettingGroup isDisabled={ 'hidden' === editorOptions.scrollbar.horizontal }>
										<Stack direction="column" gap="lg">
											<EditorOptions.ScrollbarHorizontalHasArrows />
											<EditorOptions.ScrollbarHorizontalScrollbarSize />
										</Stack>
									</SettingGroup>
									<EditorOptions.ScrollbarVertical />
									<SettingGroup isDisabled={ 'hidden' === editorOptions.scrollbar.vertical }>
										<Stack direction="column" gap="lg">
											<EditorOptions.ScrollbarVerticalHasArrows />
											<EditorOptions.ScrollbarVerticalScrollbarSize />
										</Stack>
									</SettingGroup>
									<SettingGroup
										// Disabled unless a visible scrollbar has arrows.
										isDisabled={
											! (
												( 'hidden' !== editorOptions.scrollbar.horizontal &&
													editorOptions.scrollbar.horizontalHasArrows ) ||
												( 'hidden' !== editorOptions.scrollbar.vertical &&
													editorOptions.scrollbar.verticalHasArrows )
											)
										}
									>
										<EditorOptions.ScrollbarArrowSize />
									</SettingGroup>
									<EditorOptions.OverviewRulerBorder />
									<EditorOptions.HideCursorInOverviewRuler />
								</SettingsPanel>
							</>
						) }
					</EditorConfigContext.Provider>
				</Stack>
			</Stack>
		</Stack>
	);
}
