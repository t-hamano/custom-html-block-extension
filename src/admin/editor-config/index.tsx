/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { createContext, useCallback, useContext, useState } from '@wordpress/element';
import {
	PanelBody,
	Disabled,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../index';
import EditorPreview from './components/editor-preview';
import Filter, { type EditorMode } from './components/filter';
import Controls from './components/controls';
import * as EditorSettings from './editor-settings';
import * as EditorOptions from './editor-options';
import type {
	EditorConfigContextType,
	EditorSettings as EditorSettingsType,
	EditorOptions as EditorOptionsType,
} from '../../types';

/**
 * Context
 */
export const EditorConfigContext = createContext< EditorConfigContextType >(
	{} as EditorConfigContextType
);

/**
 * Whether a setting with the given title should render under the current
 * search query. Settings whose title doesn't match the query are hidden.
 *
 * @param {string} title The setting's display title.
 * @return {boolean} True when the setting should render.
 */
export function useSearchVisibility( title: string ): boolean {
	const { searchQuery } = useContext( EditorConfigContext );
	if ( ! searchQuery ) {
		return true;
	}
	return title.toLowerCase().includes( searchQuery.toLowerCase() );
}

export default function EditorConfig() {
	const {
		isWaiting,
		editorSettings,
		editorOptions,
		setIsWaiting,
		setEditorOptions,
		setEditorSettings,
	} = useContext( AdminContext );

	const [ isEditorDisabled, setIsEditorDisabled ] = useState( false );
	const [ editorMode, setEditorMode ] = useState< EditorMode >( 'basic' );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ fontWeights, setFontWeights ] = useState( [ 300 ] );
	const { createNotice, createSuccessNotice } = useDispatch( noticesStore );

	// Update editor config.
	const onUpdateOptions = () => {
		setIsWaiting( true );

		apiFetch< { success: boolean; message: string } >( {
			path: '/custom-html-block-extension/v1/update_editor_config',
			method: 'POST',
			data: {
				editorSettings,
				editorOptions,
			},
		} ).then( ( response ) => {
			setTimeout( () => {
				createNotice( response.success ? 'success' : 'error', response.message, {
					type: 'snackbar',
				} );
				setIsWaiting( false );
			}, 600 );
		} );
	};

	// Reset editor config.
	const onResetOptions = () => {
		setIsWaiting( true );

		apiFetch< { editorSettings: EditorSettingsType; editorOptions: EditorOptionsType } >( {
			path: '/custom-html-block-extension/v1/delete_editor_config',
			method: 'POST',
		} ).then( ( response ) => {
			// Sets default editor config.
			setEditorSettings( response.editorSettings );
			setEditorOptions( response.editorOptions );

			setTimeout( () => {
				createSuccessNotice( __( 'Settings have been reset.', 'custom-html-block-extension' ), {
					type: 'snackbar',
				} );
				setIsWaiting( false );
			}, 600 );
		} );
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

	return (
		<HStack
			spacing={ 8 }
			alignment="start"
			direction="row-reverse"
			wrap
			className="chbe-admin-editor-config"
		>
			<VStack spacing={ 8 } className="chbe-admin-editor-config__preview">
				<Heading as="h2" level="3">
					{ __( 'Preview', 'custom-html-block-extension' ) }
				</Heading>
				<EditorPreview isEditorDisabled={ isEditorDisabled } setFontWeights={ setFontWeights } />
				<Controls
					isWaiting={ isWaiting }
					onUpdateOptions={ onUpdateOptions }
					onResetOptions={ onResetOptions }
				/>
			</VStack>
			<VStack spacing={ 8 } className="chbe-admin-editor-config__settings">
				<Filter
					editorMode={ editorMode }
					setEditorMode={ setEditorMode }
					searchQuery={ searchQuery }
					setSearchQuery={ setSearchQuery }
				/>
				<VStack
					className={ clsx(
						editorMode === 'basic' && ! searchQuery
							? 'chbe-admin-editor-config__basic-settings'
							: 'chbe-admin-editor-config__advanced-settings',
						{ 'is-searching': !! searchQuery }
					) }
					spacing={ editorMode === 'basic' && ! searchQuery ? 6 : 2 }
				>
					<EditorConfigContext.Provider value={ { onRefreshEditor, searchQuery } }>
						{ 'basic' === editorMode && ! searchQuery && (
							<>
								<EditorSettings.Theme />
								<EditorSettings.TabSize />
								<EditorSettings.InsertSpaces />
								<EditorSettings.Emmet />
								<EditorOptions.FontFamily />
								<EditorOptions.FontWeight fontWeights={ fontWeights } />
								<EditorOptions.FontSize />
								<EditorOptions.LineHeight />
								<EditorOptions.WordWrap />
								<EditorOptions.MinimapEnabled />
								<EditorOptions.CursorStyle />
								<EditorOptions.AutoIndent />
								<EditorOptions.QuickSuggestions />
							</>
						) }
						{ ( 'advanced' === editorMode || searchQuery ) && (
							<>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Editor', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorSettings.Theme />
										<EditorSettings.TabSize />
										<EditorSettings.InsertSpaces />
										<EditorSettings.Emmet />
										<EditorOptions.Contextmenu />
										<EditorOptions.GlyphMargin />
										<EditorOptions.PaddingTop />
										<EditorOptions.PaddingBottom />
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Font', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.FontFamily />
										<EditorOptions.FontWeight fontWeights={ fontWeights } />
										<EditorOptions.FontLigatures />
										<EditorOptions.FontSize />
										<EditorOptions.LineHeight />
										<EditorOptions.LetterSpacing />
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Word wrap', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.WordWrap />
										{ 'on' === editorOptions.wordWrap || 'off' === editorOptions.wordWrap ? (
											<Disabled>
												<EditorOptions.WordWrapColumn />
											</Disabled>
										) : (
											<EditorOptions.WordWrapColumn />
										) }
										{ 'off' === editorOptions.wordWrap ? (
											<Disabled>
												<EditorOptions.WrappingIndent />
											</Disabled>
										) : (
											<EditorOptions.WrappingIndent />
										) }
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Minimap', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.MinimapEnabled />
										{ ! editorOptions.minimap.enabled ? (
											<Disabled>
												<VStack spacing={ 4 }>
													<EditorOptions.MinimapSide />
													<EditorOptions.MinimapMaxColumn />
													<EditorOptions.MinimapScale />
													<EditorOptions.MinimapShowSlider />
													<EditorOptions.MinimapSize />
													<EditorOptions.MinimapRenderCharacters />
												</VStack>
											</Disabled>
										) : (
											<>
												<EditorOptions.MinimapSide />
												<EditorOptions.MinimapMaxColumn />
												<EditorOptions.MinimapScale />
												<EditorOptions.MinimapShowSlider />
												<EditorOptions.MinimapSize />
												<EditorOptions.MinimapRenderCharacters />
											</>
										) }
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Cursor', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.CursorStyle />
										{ 'line' !== editorOptions.cursorStyle ? (
											<Disabled>
												<EditorOptions.CursorWidth />
											</Disabled>
										) : (
											<EditorOptions.CursorWidth />
										) }
										<EditorOptions.CursorBlinking />
										<EditorOptions.CursorSurroundingLines />
										<EditorOptions.CursorSurroundingLinesStyle />
										<EditorOptions.CursorSmoothCaretAnimation />
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Code folding', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.Folding />
										{ ! editorOptions.folding ? (
											<Disabled>
												<VStack spacing={ 4 }>
													<EditorOptions.ShowFoldingControls />
													<EditorOptions.FoldingStrategy />
													<EditorOptions.LineDecorationsWidth />
													<EditorOptions.FoldingHighlight />
													<EditorOptions.UnfoldOnClickAfterEndOfLine />
												</VStack>
											</Disabled>
										) : (
											<>
												<EditorOptions.ShowFoldingControls />
												<EditorOptions.FoldingStrategy />
												<EditorOptions.LineDecorationsWidth />
												<EditorOptions.FoldingHighlight />
												<EditorOptions.UnfoldOnClickAfterEndOfLine />
											</>
										) }
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Line number', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.LineNumbers />
										{ 'off' === editorOptions.lineNumbers ? (
											<Disabled>
												<VStack spacing={ 4 }>
													<EditorOptions.LineNumbersMinChars />
													<EditorOptions.SelectOnLineNumbers />
													<EditorOptions.RenderFinalNewline />
												</VStack>
											</Disabled>
										) : (
											<>
												<EditorOptions.LineNumbersMinChars />
												<EditorOptions.SelectOnLineNumbers />
												<EditorOptions.RenderFinalNewline />
											</>
										) }
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Suggest', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.QuickSuggestions />
										{ ! editorOptions.quickSuggestions ? (
											<Disabled>
												<VStack spacing={ 4 }>
													<EditorOptions.AcceptSuggestionOnEnter />
													<EditorOptions.QuickSuggestionsDelay />
													<EditorOptions.SuggestFontSize />
													<EditorOptions.SuggestLineHeight />
													<EditorOptions.SuggestShowIcons />
												</VStack>
											</Disabled>
										) : (
											<>
												<EditorOptions.AcceptSuggestionOnEnter />
												<EditorOptions.QuickSuggestionsDelay />
												<EditorOptions.SuggestFontSize />
												<EditorOptions.SuggestLineHeight />
												<EditorOptions.SuggestShowIcons />
											</>
										) }
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Auto completion', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.AutoIndent />
										<EditorOptions.AutoClosingBrackets />
										<EditorOptions.AutoClosingQuotes />
										<EditorOptions.AutoSurround />
										<EditorOptions.FormatOnPaste />
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Mouse and scroll', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.MouseWheelScrollSensitivity />
										<EditorOptions.FastScrollSensitivity />
										<EditorOptions.Hover />
										<EditorOptions.SmoothScrolling />
										<EditorOptions.ScrollBeyondLastLine />
										<EditorOptions.ScrollBeyondLastColumn />
										<EditorOptions.MouseWheelZoom />
										<EditorOptions.DragAndDrop />
										<EditorOptions.HideCursorInOverviewRuler />
										<EditorOptions.MultiCursorModifier />
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Select, cut, copy, and paste', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.EmptySelectionClipboard />
										<EditorOptions.RoundedSelection />
										<EditorOptions.SelectionHighlight />
										<EditorOptions.MultiCursorPaste />
										<EditorOptions.StickyTabStops />
										<EditorOptions.CopyWithSyntaxHighlighting />
										<EditorOptions.ColumnSelection />
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Highlight and rendering', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.MatchBrackets />
										<EditorOptions.OccurrencesHighlight />
										<EditorOptions.RenderWhitespace />
										<EditorOptions.RenderLineHighlight />
										{ 'none' === editorOptions.renderLineHighlight ? (
											<Disabled>
												<EditorOptions.RenderLineHighlightOnlyWhenFocus />
											</Disabled>
										) : (
											<EditorOptions.RenderLineHighlightOnlyWhenFocus />
										) }
										<EditorOptions.RenderIndentGuides />
										{ ! editorOptions.renderIndentGuides ? (
											<Disabled>
												<EditorOptions.HighlightActiveIndentGuide />
											</Disabled>
										) : (
											<EditorOptions.HighlightActiveIndentGuide />
										) }
										<EditorOptions.RenderControlCharacters />
										<EditorOptions.Rulers />
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Find', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.FindAddExtraSpaceOnTop />
										<EditorOptions.FindSeedSearchStringFromSelection />
										<EditorOptions.FindLoop />
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Scrollbar', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.ScrollbarUseShadows />
										<EditorOptions.OverviewRulerBorder />
										<EditorOptions.ScrollbarAlwaysConsumeMouseWheel />
										<EditorOptions.ScrollbarScrollByPage />
										<EditorOptions.ScrollbarHorizontal />
										{ 'hidden' === editorOptions.scrollbar.horizontal ? (
											<Disabled>
												<VStack spacing={ 4 }>
													<EditorOptions.ScrollbarHorizontalHasArrows />
													<EditorOptions.ScrollbarHorizontalScrollbarSize />
												</VStack>
											</Disabled>
										) : (
											<>
												<EditorOptions.ScrollbarHorizontalHasArrows />
												<EditorOptions.ScrollbarHorizontalScrollbarSize />
											</>
										) }
										<EditorOptions.ScrollbarVertical />
										{ 'hidden' === editorOptions.scrollbar.vertical ? (
											<Disabled>
												<VStack spacing={ 4 }>
													<EditorOptions.ScrollbarVerticalHasArrows />
													<EditorOptions.ScrollbarVerticalScrollbarSize />
												</VStack>
											</Disabled>
										) : (
											<>
												<EditorOptions.ScrollbarVerticalHasArrows />
												<EditorOptions.ScrollbarVerticalScrollbarSize />
											</>
										) }
										{ ( ! editorOptions.scrollbar.horizontalHasArrows &&
											! editorOptions.scrollbar.verticalHasArrows ) ||
										( 'hidden' === editorOptions.scrollbar.horizontal &&
											'hidden' === editorOptions.scrollbar.vertical ) ? (
											<Disabled>
												<EditorOptions.ScrollbarArrowSize />
											</Disabled>
										) : (
											<EditorOptions.ScrollbarArrowSize />
										) }
									</VStack>
								</PanelBody>
								<PanelBody
									className="chbe-admin-editor-config__panel"
									title={ __( 'Other', 'custom-html-block-extension' ) }
									initialOpen={ !! searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.UseTabStops />
										<EditorOptions.CommentsInsertSpace />
										<EditorOptions.Links />
									</VStack>
								</PanelBody>
							</>
						) }
					</EditorConfigContext.Provider>
				</VStack>
			</VStack>
		</HStack>
	);
}
