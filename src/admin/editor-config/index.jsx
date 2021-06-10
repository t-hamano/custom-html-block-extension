/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { addNotification } from 'admin/common/helper';
import MonacoEditor from 'admin/editor-config/monaco-editor';
import Mode from 'admin/editor-config/mode';
import ButtonMenu from 'admin/editor-config/button-menu';
import * as EditorSettings from 'admin/editor-config/editor-settings';
import * as EditorOptions from 'admin/editor-config/editor-options';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import {
	createContext,
	useContext,
	useState
} from '@wordpress/element';

import {
	PanelBody,
	Button,
	Disabled
} from '@wordpress/components';

/**
 * Context
 */
export const EditorConfigContext = createContext();

const EditorConfig = () => {

	const {
		isWaiting,
		editorSettings,
		editorOptions,
		setIsWaiting,
		setEditorOptions,
		setEditorSettings
	} = useContext( AdminContext );

	const [ isEditorDisabled, setIsEditorDisabled ] = useState( false );
	const [ editorMode, setEditorMode ] = useState( 'basic' );
	const [ fontWeights, setFontWeights ] = useState([ 300 ]);

	// Update editor config.
	const handleUpdateOptions = () => {
		setIsWaiting( true );

		apiFetch({
			path: '/custom-html-block-extension/v1/update_editor_config',
			method: 'POST',
			data: {
				editorSettings: editorSettings,
				editorOptions: editorOptions
			}
		}).then( ( response ) => {
			setTimeout( () => {
				addNotification( response.message, response.success ? 'success' : 'danger' );
				setIsWaiting( false );
			}, 600 );
		});
	};

	// Reset editor config.
	const handleResetOptions = () => {
		setIsWaiting( true );

		apiFetch({
			path: '/custom-html-block-extension/v1/delete_editor_config',
			method: 'POST'
		}).then( ( response ) => {

			// Sets default editor config.
			setEditorSettings( response.editorSettings );
			setEditorOptions( response.editorOptions );

			setTimeout( () => {
				addNotification( __( 'Settings have been reset.', 'custom-html-block-extension' ), 'success' );
				setIsWaiting( false );
			}, 600 );
		});
	};

	// Refresh editor.
	const refreshEditor = () => {

		// Some options are not reflected when the state is changed.
		// So disable the editor for a moment by Disabled component as a workaround.
		setIsEditorDisabled( true );
		setTimeout( () => {
			setIsEditorDisabled( false );
		}, 300 );
	};

	return (
		<div className="chbe-config">
			<div className="chbe-config__preview">
				<h2>{ __( 'Preview', 'custom-html-block-extension' ) }</h2>
				<MonacoEditor
					isEditorDisabled={ isEditorDisabled }
					setFontWeights={ setFontWeights }
				/>
				<ButtonMenu
					isWaiting= { isWaiting }
					handleUpdateOptions={ handleUpdateOptions }
					handleResetOptions={ handleResetOptions }
				/>
			</div>
			<div className="chbe-config__settings">
				<Mode
					editorMode={ editorMode }
					setEditorMode={ setEditorMode }
				/>
				<div className={ 'chbe-config__controls chbe-config__controls--' + editorMode }>
					<EditorConfigContext.Provider value={{ refreshEditor }}>
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
						)}
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
									title={ __( 'Word Wrap', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
									<EditorOptions.WordWrap />
									{ 'on' === editorOptions.wordWrap || 'off' === editorOptions.wordWrap ? (
										<Disabled>
											<EditorOptions.WordWrapColumn />
										</Disabled>
									) : (
										<EditorOptions.WordWrapColumn />
									)}
									{ 'off' === editorOptions.wordWrap ? (
										<Disabled>
											<EditorOptions.WrappingIndent />
										</Disabled>
									) : (
										<EditorOptions.WrappingIndent />
									)}
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
									)}
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
									)}
									<EditorOptions.CursorBlinking />
									<EditorOptions.CursorSurroundingLines />
									<EditorOptions.CursorSurroundingLinesStyle />
									<EditorOptions.CursorSmoothCaretAnimation />
								</PanelBody>
								<PanelBody
									title={ __( 'Code Folding', 'custom-html-block-extension' ) }
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
									)}
								</PanelBody>
								<PanelBody
									title={ __( 'Line Number', 'custom-html-block-extension' ) }
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
									)}
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
									)}
								</PanelBody>
								<PanelBody
									title={ __( 'Auto Completion', 'custom-html-block-extension' ) }
									initialOpen={ false }
								>
									<EditorOptions.AutoIndent />
									<EditorOptions.AutoClosingBrackets />
									<EditorOptions.AutoClosingQuotes />
									<EditorOptions.AutoSurround />
									<EditorOptions.FormatOnPaste />
								</PanelBody>
								<PanelBody
									title={ __( 'Mouse and Scroll', 'custom-html-block-extension' ) }
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
									title={ __( 'Select, Cut, Copy, Paste', 'custom-html-block-extension' ) }
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
									title={ __( 'Highlight and Rendering', 'custom-html-block-extension' ) }
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
									)}
									<EditorOptions.RenderIndentGuides />
									{ ! editorOptions.renderIndentGuides ? (
										<Disabled>
											<EditorOptions.HighlightActiveIndentGuide />
										</Disabled>
									) : (
										<EditorOptions.HighlightActiveIndentGuide />
									)}
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
									<div className="chbe-config__controls-group">
										<EditorOptions.ScrollbarAlwaysConsumeMouseWheel />
										<EditorOptions.ScrollbarScrollByPage />
										<EditorOptions.ScrollbarHorizontal />
										{  'hidden' === editorOptions.scrollbar.horizontal ? (
											<Disabled>
												<EditorOptions.ScrollbarHorizontalHasArrows />
												<EditorOptions.ScrollbarHorizontalScrollbarSize />
											</Disabled>
										) : (
											<>
												<EditorOptions.ScrollbarHorizontalHasArrows />
												<EditorOptions.ScrollbarHorizontalScrollbarSize />
											</>
										)}
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
										)}
										{ ! editorOptions.scrollbar.horizontalHasArrows && ! editorOptions.scrollbar.verticalHasArrows || 'hidden' === editorOptions.scrollbar.horizontal && 'hidden' === editorOptions.scrollbar.vertical ? (
											<Disabled>
												<EditorOptions.ScrollbarArrowSize />
											</Disabled>
										) : (
											<EditorOptions.ScrollbarArrowSize />
										)}
										<p>{ __( 'Settings in this group will be reflected in the preview area when you press the refresh editor button.', 'custom-html-block-extension' ) }</p>
										<Button
											isPrimary
											disabled={ isEditorDisabled }
											onClick={ refreshEditor }
										>
											{ __( 'Refresh editor', 'custom-html-block-extension' ) }
										</Button>
									</div>
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
};

export default EditorConfig;

