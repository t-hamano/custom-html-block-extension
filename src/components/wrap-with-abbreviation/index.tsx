/**
 * External dependencies
 */
import type * as Monaco from 'monaco-editor';
import type { FocusEvent, KeyboardEvent } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createRoot } from '@wordpress/element';
import { InputControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { getWrapTargets, wrapWithAbbreviation } from './utils';

const WIDGET_ID = 'chbe.wrapWithAbbreviation.widget';

// Models whose content is being changed to update the preview.
const wrapPreviewModels = new WeakSet< Monaco.editor.ITextModel >();

/**
 * Whether the content change is for the preview of the wrapped text, which
 * shouldn't be synced to the original content until it's confirmed.
 *
 * @param editor The editor instance.
 * @return Whether the preview is being updated.
 */
export function isApplyingWrapPreview( editor: Monaco.editor.ICodeEditor ): boolean {
	const model = editor.getModel();
	return !! model && wrapPreviewModels.has( model );
}

/**
 * Add the "Emmet: Wrap with Abbreviation" action to the editor, which is available
 * from the command palette and the context menu.
 *
 * While typing the abbreviation, the result is previewed in the editor without
 * being added to the undo stack. Confirming it applies the result as a single edit.
 *
 * @param monaco The monaco instance.
 * @param editor The editor instance.
 */
export default function addWrapWithAbbreviationAction(
	monaco: typeof Monaco,
	editor: Monaco.editor.IStandaloneCodeEditor
) {
	let isOpen = false;
	let disposeWidget: ( () => void ) | null = null;

	// Close the widget without reverting the preview when the editor or its model is disposed,
	// e.g. the classic editor disposes the models when switching to the visual mode.
	editor.onDidDispose( () => disposeWidget?.() );
	editor.onDidChangeModel( () => disposeWidget?.() );

	editor.addAction( {
		id: 'chbe.wrapWithAbbreviation',
		label: __( 'Emmet: Wrap with Abbreviation', 'custom-html-block-extension' ),
		contextMenuGroupId: '1_modification',
		run: () => {
			const model = editor.getModel();
			const selections = editor.getSelections();
			if (
				isOpen ||
				! model ||
				! selections ||
				editor.getOption( monaco.editor.EditorOption.readOnly )
			) {
				return;
			}

			const targets = getWrapTargets( model, selections );
			const { insertSpaces, indentSize } = model.getOptions();
			const indent = insertSpaces ? ' '.repeat( indentSize ) : '\t';

			// Edits to revert the current preview.
			let undoEdits: Monaco.editor.IValidEditOperation[] = [];
			let wrappedTexts: string[] | null = null;

			const container = editor.getContainerDomNode().ownerDocument.createElement( 'div' );
			container.className = 'chbe-wrap-with-abbreviation';
			// Show the widget below the last target, including its preview, so that it
			// doesn't hide the preview.
			const widget: Monaco.editor.IContentWidget = {
				allowEditorOverflow: true,
				getId: () => WIDGET_ID,
				getDomNode: () => container,
				getPosition: () => ( {
					position: {
						lineNumber: Math.max(
							...( undoEdits.length ? undoEdits : targets ).map(
								( { range } ) => range.endLineNumber
							)
						),
						column: 1,
					},
					preference: [
						monaco.editor.ContentWidgetPositionPreference.BELOW,
						monaco.editor.ContentWidgetPositionPreference.ABOVE,
					],
				} ),
			};

			const applyPreviewEdits = ( edits: Monaco.editor.IIdentifiedSingleEditOperation[] ) => {
				wrapPreviewModels.add( model );
				try {
					return model.applyEdits( edits, true );
				} finally {
					wrapPreviewModels.delete( model );
				}
			};

			const revertPreview = () => {
				applyPreviewEdits( undoEdits );
				undoEdits = [];
			};

			const getEdits = ( texts: string[] ) =>
				targets.map( ( { range }, index ) => ( { range, text: texts[ index ] } ) );

			const onChange = ( abbreviation: string ) => {
				revertPreview();
				const texts = targets.map( ( target ) =>
					wrapWithAbbreviation( abbreviation, target, indent )
				);
				wrappedTexts = texts.every( ( text ) => null !== text ) ? ( texts as string[] ) : null;
				if ( wrappedTexts ) {
					undoEdits = applyPreviewEdits( getEdits( wrappedTexts ) );
				}
				editor.layoutContentWidget( widget );
			};

			const root = createRoot( container );

			const { ownerDocument } = container;

			const unmount = () => {
				if ( disposeWidget !== dispose ) {
					return;
				}
				disposeWidget = null;
				root.unmount();
			};

			// Clean up the widget without accessing the model, which may be already disposed.
			const dispose = () => {
				isOpen = false;
				ownerDocument.removeEventListener( 'pointerdown', onPointerDown, true );
				unmount();
			};

			const close = ( shouldApply: boolean, shouldFocusEditor: boolean ) => {
				if ( ! isOpen ) {
					return;
				}
				isOpen = false;
				revertPreview();

				if ( ! shouldApply || ! wrappedTexts ) {
					// Restore the selections moved by the preview.
					editor.setSelections( selections );
				} else {
					editor.pushUndoStop();
					editor.executeEdits(
						'chbe.wrapWithAbbreviation',
						getEdits( wrappedTexts ),
						( inverseEdits ) =>
							// Place the cursor at the end of each wrapped text.
							inverseEdits.map(
								( { range } ) =>
									new monaco.Selection(
										range.endLineNumber,
										range.endColumn,
										range.endLineNumber,
										range.endColumn
									)
							)
					);
					editor.pushUndoStop();
				}

				ownerDocument.removeEventListener( 'pointerdown', onPointerDown, true );
				editor.removeContentWidget( widget );
				// Unmount asynchronously since this can be called while rendering.
				setTimeout( unmount );
				if ( shouldFocusEditor ) {
					editor.focus();
				}
			};

			// Close the widget when clicking outside it, including the editor.
			const onPointerDown = ( event: PointerEvent ) => {
				if ( ! container.contains( event.target as Node ) ) {
					close( false, false );
				}
			};

			const onBlur = ( event: FocusEvent< HTMLInputElement > ) => {
				if ( ! isOpen ) {
					return;
				}
				// The command palette and the context menu restore the focus to the editor
				// after running the action, so take the focus back.
				if ( editor.getDomNode()?.contains( event.relatedTarget as Node | null ) ) {
					event.target.focus();
				} else {
					close( false, false );
				}
			};

			const onKeyDown = ( event: KeyboardEvent< HTMLInputElement > ) => {
				event.stopPropagation();
				if ( event.nativeEvent.isComposing ) {
					return;
				}
				if ( 'Enter' === event.key ) {
					event.preventDefault();
					close( true, true );
				} else if ( 'Escape' === event.key ) {
					event.preventDefault();
					close( false, true );
				}
			};

			isOpen = true;
			disposeWidget = dispose;
			ownerDocument.addEventListener( 'pointerdown', onPointerDown, true );
			editor.addContentWidget( widget );
			// Render the widget immediately, since the input can't be focused while it's hidden.
			editor.render( true );
			root.render(
				<InputControl
					ref={ ( input ) => input?.focus() }
					label={ __( 'Abbreviation', 'custom-html-block-extension' ) }
					hideLabelFromVision
					description={ __(
						"Enter Abbreviation (Press 'Enter' to confirm or 'Escape' to cancel)",
						'custom-html-block-extension'
					) }
					size="compact"
					onChange={ ( event ) => onChange( event.target.value ) }
					onKeyDown={ onKeyDown }
					onBlur={ onBlur }
					autoComplete="off"
					spellCheck={ false }
				/>
			);
		},
	} );
}
