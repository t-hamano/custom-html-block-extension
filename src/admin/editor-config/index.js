/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { createContext, useContext, useState } from '@wordpress/element';
import {
	PanelBody,
	Disabled,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../index';
import { addNotification } from '../../lib/helper';
import EditorPreview from './components/editor-preview';
import Filter from './components/filter';
import Controls from './components/controls';
import * as EditorSettings from './editor-settings';
import * as EditorOptions from './editor-options';

/**
 * Context
 */
export const EditorConfigContext = createContext();

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
	const [ editorMode, setEditorMode ] = useState( 'basic' );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ fontWeights, setFontWeights ] = useState( [ 300 ] );

	// Update editor config.
	const onUpdateOptions = () => {
		setIsWaiting( true );

		apiFetch( {
			path: '/custom-html-block-extension/v1/update_editor_config',
			method: 'POST',
			data: {
				editorSettings,
				editorOptions,
			},
		} ).then( ( response ) => {
			setTimeout( () => {
				addNotification( response.message, response.success ? 'success' : 'danger' );
				setIsWaiting( false );
			}, 600 );
		} );
	};

	// Reset editor config.
	const onResetOptions = () => {
		setIsWaiting( true );

		apiFetch( {
			path: '/custom-html-block-extension/v1/delete_editor_config',
			method: 'POST',
		} ).then( ( response ) => {
			// Sets default editor config.
			setEditorSettings( response.editorSettings );
			setEditorOptions( response.editorOptions );

			setTimeout( () => {
				addNotification(
					__( 'Settings have been reset.', 'custom-html-block-extension' ),
					'success'
				);
				setIsWaiting( false );
			}, 600 );
		} );
	};

	// Refresh editor.
	const onRefreshEditor = () => {
		// Some options are not reflected when the state is changed.
		// So disable the editor for a moment by Disabled component as a workaround.
		setIsEditorDisabled( true );
		setTimeout( () => {
			setIsEditorDisabled( false );
		}, 300 );
	};

	return (
		<HStack
			spacing={ 8 }
			align="start"
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
					className={
						editorMode === 'basic' && ! searchQuery
							? 'chbe-admin-editor-config__basic-settings'
							: 'chbe-admin-editor-config__advanced-settings'
					}
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
									title={ __( 'Editor', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorSettings.Theme category="editor" />
										<EditorSettings.TabSize category="editor" />
										<EditorSettings.InsertSpaces category="editor" />
										<EditorSettings.Emmet category="editor" />
										<EditorOptions.Contextmenu category="editor" />
										<EditorOptions.GlyphMargin category="editor" />
										<EditorOptions.PaddingTop category="editor" />
										<EditorOptions.PaddingBottom category="editor" />
									</VStack>
								</PanelBody>
								<PanelBody
									title={ __( 'Font', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
									title={ __( 'Word wrap', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
									title={ __( 'Minimap', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.MinimapEnabled />
										{ ! editorOptions.minimap.enabled ? (
											<Disabled>
												<EditorOptions.MinimapSide />
												<EditorOptions.MinimapMaxColumn />
												<EditorOptions.MinimapScale />
												<EditorOptions.MinimapShowSlider />
												<EditorOptions.MinimapSize />
												<EditorOptions.MinimapRenderCharacters />
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
									title={ __( 'Cursor', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
									title={ __( 'Code folding', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.Folding />
										{ ! editorOptions.folding ? (
											<Disabled>
												<EditorOptions.ShowFoldingControls />
												<EditorOptions.FoldingStrategy />
												<EditorOptions.LineDecorationsWidth />
												<EditorOptions.FoldingHighlight />
												<EditorOptions.UnfoldOnClickAfterEndOfLine />
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
									title={ __( 'Line number', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.LineNumbers />
										{ 'off' === editorOptions.lineNumbers ? (
											<Disabled>
												<EditorOptions.LineNumbersMinChars />
												<EditorOptions.SelectOnLineNumbers />
												<EditorOptions.RenderFinalNewline />
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
									title={ __( 'Suggest', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.QuickSuggestions />
										{ ! editorOptions.quickSuggestions ? (
											<Disabled>
												<EditorOptions.AcceptSuggestionOnEnter />
												<EditorOptions.QuickSuggestionsDelay />
												<EditorOptions.SuggestFontSize />
												<EditorOptions.SuggestLineHeight />
												<EditorOptions.SuggestShowIcons />
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
									title={ __( 'Auto completion', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
									title={ __( 'Mouse and scroll', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
									title={ __( 'Select, cut, copy, and paste', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
									title={ __( 'Highlight and rendering', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
									title={ __( 'Find', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
									scrollAfterOpen={ ! searchQuery }
								>
									<VStack spacing={ 4 }>
										<EditorOptions.FindAddExtraSpaceOnTop />
										<EditorOptions.FindSeedSearchStringFromSelection />
										<EditorOptions.FindLoop />
									</VStack>
								</PanelBody>
								<PanelBody
									title={ __( 'Scrollbar', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
												<EditorOptions.ScrollbarHorizontalHasArrows />
												<EditorOptions.ScrollbarHorizontalScrollbarSize />
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
												<EditorOptions.ScrollbarVerticalHasArrows />
												<EditorOptions.ScrollbarVerticalScrollbarSize />
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
									title={ __( 'Other', 'custom-html-block-extension' ) }
									initialOpen={ searchQuery }
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
