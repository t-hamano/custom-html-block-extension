/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { createContext, useCallback, useContext, useState } from '@wordpress/element';
import { __experimentalHeading as Heading } from '@wordpress/components';
import { Card, CollapsibleCard, Stack } from '@wordpress/ui';
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

/**
 * A collapsible settings panel. While a search query is active, every panel is
 * forced open so the matching settings inside it are revealed; otherwise the
 * open state is left to the user (uncontrolled-like behavior via local state).
 *
 * @param {Object}    props          Component props.
 * @param {string}    props.title    The panel's display title.
 * @param {ReactNode} props.children The settings rendered inside the panel.
 */
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
		<Stack align="start" wrap="wrap" className="chbe-admin-editor-config" gap="xl">
			<Stack direction="column" className="chbe-admin-editor-config__preview" gap="xl">
				<Heading as="h2" level="3">
					{ __( 'Preview', 'custom-html-block-extension' ) }
				</Heading>
				<EditorPreview isEditorDisabled={ isEditorDisabled } setFontWeights={ setFontWeights } />
				<Controls
					isWaiting={ isWaiting }
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
								<SettingsPanel title={ __( 'Editor', 'custom-html-block-extension' ) }>
									<EditorSettings.Theme />
									<EditorSettings.TabSize />
									<EditorSettings.InsertSpaces />
									<EditorSettings.Emmet />
									<EditorOptions.Contextmenu />
									<EditorOptions.GlyphMargin />
									<EditorOptions.PaddingTop />
									<EditorOptions.PaddingBottom />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Font', 'custom-html-block-extension' ) }>
									<EditorOptions.FontFamily />
									<EditorOptions.FontWeight fontWeights={ fontWeights } />
									<EditorOptions.FontLigatures />
									<EditorOptions.FontSize />
									<EditorOptions.LineHeight />
									<EditorOptions.LetterSpacing />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Word wrap', 'custom-html-block-extension' ) }>
									<EditorOptions.WordWrap />
									<div
										inert={
											'on' === editorOptions.wordWrap || 'off' === editorOptions.wordWrap
												? ''
												: undefined
										}
									>
										<EditorOptions.WordWrapColumn />
									</div>
									<div inert={ 'off' === editorOptions.wordWrap ? '' : undefined }>
										<EditorOptions.WrappingIndent />
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Minimap', 'custom-html-block-extension' ) }>
									<EditorOptions.MinimapEnabled />
									<div inert={ ! editorOptions.minimap.enabled ? '' : undefined }>
										<Stack direction="column" gap="lg">
											<EditorOptions.MinimapSide />
											<EditorOptions.MinimapMaxColumn />
											<EditorOptions.MinimapScale />
											<EditorOptions.MinimapShowSlider />
											<EditorOptions.MinimapSize />
											<EditorOptions.MinimapRenderCharacters />
										</Stack>
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Cursor', 'custom-html-block-extension' ) }>
									<EditorOptions.CursorStyle />
									<div inert={ 'line' !== editorOptions.cursorStyle ? '' : undefined }>
										<EditorOptions.CursorWidth />
									</div>
									<EditorOptions.CursorBlinking />
									<EditorOptions.CursorSurroundingLines />
									<EditorOptions.CursorSurroundingLinesStyle />
									<EditorOptions.CursorSmoothCaretAnimation />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Code folding', 'custom-html-block-extension' ) }>
									<EditorOptions.Folding />
									<div inert={ ! editorOptions.folding ? '' : undefined }>
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
									<div inert={ 'off' === editorOptions.lineNumbers ? '' : undefined }>
										<Stack direction="column" gap="lg">
											<EditorOptions.LineNumbersMinChars />
											<EditorOptions.SelectOnLineNumbers />
											<EditorOptions.RenderFinalNewline />
										</Stack>
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Suggest', 'custom-html-block-extension' ) }>
									<EditorOptions.QuickSuggestions />
									<div inert={ ! editorOptions.quickSuggestions ? '' : undefined }>
										<Stack direction="column" gap="lg">
											<EditorOptions.AcceptSuggestionOnEnter />
											<EditorOptions.QuickSuggestionsDelay />
											<EditorOptions.SuggestFontSize />
											<EditorOptions.SuggestLineHeight />
											<EditorOptions.SuggestShowIcons />
										</Stack>
									</div>
								</SettingsPanel>
								<SettingsPanel title={ __( 'Auto completion', 'custom-html-block-extension' ) }>
									<EditorOptions.AutoIndent />
									<EditorOptions.AutoClosingBrackets />
									<EditorOptions.AutoClosingQuotes />
									<EditorOptions.AutoSurround />
									<EditorOptions.FormatOnPaste />
								</SettingsPanel>
								<SettingsPanel title={ __( 'Mouse and scroll', 'custom-html-block-extension' ) }>
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
									<EditorOptions.OccurrencesHighlight />
									<EditorOptions.RenderWhitespace />
									<EditorOptions.RenderLineHighlight />
									<div inert={ 'none' === editorOptions.renderLineHighlight ? '' : undefined }>
										<EditorOptions.RenderLineHighlightOnlyWhenFocus />
									</div>
									<EditorOptions.RenderIndentGuides />
									<div inert={ ! editorOptions.renderIndentGuides ? '' : undefined }>
										<EditorOptions.HighlightActiveIndentGuide />
									</div>
									<EditorOptions.RenderControlCharacters />
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
									<div inert={ 'hidden' === editorOptions.scrollbar.horizontal ? '' : undefined }>
										<Stack direction="column" gap="lg">
											<EditorOptions.ScrollbarHorizontalHasArrows />
											<EditorOptions.ScrollbarHorizontalScrollbarSize />
										</Stack>
									</div>
									<EditorOptions.ScrollbarVertical />
									<div inert={ 'hidden' === editorOptions.scrollbar.vertical ? '' : undefined }>
										<Stack direction="column" gap="lg">
											<EditorOptions.ScrollbarVerticalHasArrows />
											<EditorOptions.ScrollbarVerticalScrollbarSize />
										</Stack>
									</div>
									<div
										inert={
											( ! editorOptions.scrollbar.horizontalHasArrows &&
												! editorOptions.scrollbar.verticalHasArrows ) ||
											( 'hidden' === editorOptions.scrollbar.horizontal &&
												'hidden' === editorOptions.scrollbar.vertical )
												? ''
												: undefined
										}
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
