/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { createContext, useContext, useState } from '@wordpress/element';
import { PanelBody, Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { addNotification } from 'lib/helper';
import EditorPreview from 'admin/editor-config/components/editor-preview';
import Modes from './components/modes';
import Controls from 'admin/editor-config/components/controls';
import * as EditorSettings from 'admin/editor-config/editor-settings';
import * as EditorOptions from 'admin/editor-config/editor-options';

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
		<div className="chbe-admin-editor-config">
			<div className="chbe-admin-editor-config__preview">
				<h2 className="chbe-admin-editor-config__preview-title">
					{ __( 'Preview', 'custom-html-block-extension' ) }
				</h2>
				<EditorPreview isEditorDisabled={ isEditorDisabled } setFontWeights={ setFontWeights } />
				<Controls
					isWaiting={ isWaiting }
					onUpdateOptions={ onUpdateOptions }
					onResetOptions={ onResetOptions }
				/>
			</div>
			<div className="chbe-admin-editor-config__settings">
				<Modes editorMode={ editorMode } setEditorMode={ setEditorMode } />
				<div
					className={
						editorMode === 'basic'
							? 'chbe-admin-editor-config__basic-settings'
							: 'chbe-admin-editor-config__advanced-settings'
					}
				>
					<EditorConfigContext.Provider value={ { onRefreshEditor } }>
						{ 'basic' === editorMode && (
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
						{ 'advanced' === editorMode && (
							<>
								<PanelBody
									title={ __( 'Editor', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
									<EditorSettings.Theme />
									<EditorSettings.TabSize />
									<EditorSettings.InsertSpaces />
									<EditorSettings.Emmet />
									<EditorOptions.Contextmenu />
									<EditorOptions.GlyphMargin />
									<EditorOptions.PaddingTop />
									<EditorOptions.PaddingBottom />
								</PanelBody>
								<PanelBody
									title={ __( 'Font', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
									<EditorOptions.FontFamily />
									<EditorOptions.FontWeight fontWeights={ fontWeights } />
									<EditorOptions.FontLigatures />
									<EditorOptions.FontSize />
									<EditorOptions.LineHeight />
									<EditorOptions.LetterSpacing />
								</PanelBody>
								<PanelBody
									title={ __( 'Word wrap', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Minimap', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Cursor', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Code folding', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Line number', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Suggest', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Auto completion', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
									<EditorOptions.AutoIndent />
									<EditorOptions.AutoClosingBrackets />
									<EditorOptions.AutoClosingQuotes />
									<EditorOptions.AutoSurround />
									<EditorOptions.FormatOnPaste />
								</PanelBody>
								<PanelBody
									title={ __( 'Mouse and scroll', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Select, cut, copy, and paste', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
									<EditorOptions.EmptySelectionClipboard />
									<EditorOptions.RoundedSelection />
									<EditorOptions.SelectionHighlight />
									<EditorOptions.MultiCursorPaste />
									<EditorOptions.StickyTabStops />
									<EditorOptions.CopyWithSyntaxHighlighting />
									<EditorOptions.ColumnSelection />
								</PanelBody>
								<PanelBody
									title={ __( 'Highlight and rendering', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Find', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
									<EditorOptions.FindAddExtraSpaceOnTop />
									<EditorOptions.FindSeedSearchStringFromSelection />
									<EditorOptions.FindLoop />
								</PanelBody>
								<PanelBody
									title={ __( 'Scrollbar', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
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
								</PanelBody>
								<PanelBody
									title={ __( 'Other', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
									<EditorOptions.UseTabStops />
									<EditorOptions.CommentsInsertSpace />
									<EditorOptions.Links />
								</PanelBody>
							</>
						) }
					</EditorConfigContext.Provider>
				</div>
			</div>
		</div>
	);
}
