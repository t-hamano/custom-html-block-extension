/**
 * External dependencies
 */
import Editor from '@monaco-editor/react';
import webfontloader from 'webfontloader';
import { emmetHTML } from 'emmet-monaco-es';

/**
 * Internal dependencies
 */
import themes from 'themes';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import {
	BlockControls,
	transformStyles,
	useBlockProps,
	store as blockEditorStore
} from '@wordpress/block-editor';

import {
	ResizableBox,
	ToolbarButton,
	Disabled,
	SandBox,
	ToolbarGroup
} from '@wordpress/components';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 1000;

export default function HTMLEdit({
	attributes,
	isSelected,
	setAttributes,
	toggleSelection
}) {
	const {
		content,
		height
	} = attributes;

	const [ isPreview, setIsPreview ] = useState();

	const styles = useSelect( ( select ) => {
		const defaultStyles = `
			html,body,:root {
				margin: 0 !important;
				padding: 0 !important;
				overflow: visible !important;
				min-height: auto !important;
			}
		`;

		return [
			defaultStyles,
			...transformStyles(
				select( 'core/block-editor' ).getSettings().styles
			)
		];
	}, []);

	const handleEditorDidMount = ( editor, monaco ) => {

		// Enable Emmet only once because monaco instances are common to all blocks.
		if ( chbeObj.editorSettings.emmet && ! monaco.enabledEmmet ) {
			monaco.enabledEmmet = true;
			emmetHTML( monaco );
		}

		// Update editor settings.
		if ( 'vs-dark' !== chbeObj.editorSettings.theme && 'light' !== chbeObj.editorSettings.theme ) {
			const theme = themes.find( ( data ) => chbeObj.editorSettings.theme === data.value );
			if ( undefined !== theme ) {
				monaco.editor.defineTheme( theme.value, theme.data );
				monaco.editor.setTheme( theme.value );
			}
		}

		editor.getModel().updateOptions({
			tabSize: chbeObj.editorSettings.tabSize,
			insertSpaces: chbeObj.editorSettings.insertSpaces
		});

		// Load webfont.
		const font = chbeObj.fontFamily.find( ( data ) => chbeObj.editorOptions.fontFamily === data.name );

		if ( undefined !== font && 'label' in font ) {
			const webfontConfig = {
				custom: {
					families: [ font.name ]
				}
			};

			if ( 'stylesheet' in font ) {
				webfontConfig.custom.urls = [ font.stylesheet ];
			}

			webfontloader.load({
				timeout: 2000,
				...webfontConfig,
				active: () => {

					// Adjust the position of the cursor and space.
					monaco.editor.remeasureFonts();
				}
			});
		}

		// Ctrl+X shortcut without a range selection will cut the block,
		// so catch the command and execute custom action instead.
		editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_X, () => {
			if ( chbeObj.editorOptions.emptySelectionClipboard ) {
				const selection = editor.getSelection();
				const lineNumber = editor.getPosition().lineNumber;

				// Select the entire current line and next line first column if there is no range selection.
				if ( selection.startLineNumber === selection.endLineNumber && selection.startColumn === selection.endColumn ) {
					editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
				}

				document.execCommand( 'cut' );
			}
		});

		// Ctrl+C shortcut without a range selection will copy the block,
		// so catch the command and execute custom action instead.
		editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C, () => {
			if ( chbeObj.editorOptions.emptySelectionClipboard ) {
				const selection = editor.getSelection();
				const lineNumber = editor.getPosition().lineNumber;

				// Select the entire current line and next line first column if there is no range selection.
				if ( selection.startLineNumber === selection.endLineNumber && selection.startColumn === selection.endColumn ) {
					editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
				}

				document.execCommand( 'copy' );

				// Undo the state of a selection.
				editor.setSelection( new monaco.Selection( selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn ) );
			}
		});
	};

	const handleResizeStart = ( ...args ) => {
		toggleSelection( false );
	};

	const handleResizeStop = ( event, direction, elt, delta ) => {
		const newHeight = Math.min(
			Math.max(
				parseInt( height + delta.height, 10 ),
				MIN_HEIGHT
			),
			MAX_HEIGHT
		);
		setAttributes({ height: newHeight });
	};

	const handleChangeContent = ( value ) => {
		setAttributes({ content: value });
	};

	function switchToPreview() {
		setIsPreview( true );
	}

	function switchToHTML() {
		setIsPreview( false );
	}

	return (
		<div { ...useBlockProps({ className: 'block-library-html__edit' }) }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						className="components-tab-button"
						isPressed={ ! isPreview }
						onClick={ switchToHTML }
					>
						<span>{ __( 'HTML', 'custom-html-block-extension' ) }</span>
					</ToolbarButton>
					<ToolbarButton
						className="components-tab-button"
						isPressed={ isPreview }
						onClick={ switchToPreview }
					>
						<span>{ __( 'Preview', 'custom-html-block-extension' ) }</span>
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<Disabled.Consumer>
				{ ( isDisabled ) =>
					isPreview || isDisabled ? (
						<>
							<SandBox
								html={ content }
								styles={ styles }
							/>
							{ ! isSelected && (
								<div className="block-library-html__preview-overlay"></div>
							) }
						</>
					) : (
						<ResizableBox
							size={ { height: height } }
							minHeight={ MIN_HEIGHT }
							enable={ {
								top: false,
								right: false,
								bottom: true,
								left: false,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false
							} }
							onResizeStart={ handleResizeStart }
							onResizeStop={ handleResizeStop }
							showHandle={ isSelected }
							__experimentalShowTooltip={ true }
						>
							<Editor
								theme={ chbeObj.editorSettings.theme }
								language="html"
								loading={ __( 'Loading...', 'custom-html-block-extension' ) }
								value={ content }
								options={ chbeObj.editorOptions }

								onChange={ handleChangeContent }
								onMount={ handleEditorDidMount }
							/>
						</ResizableBox>
					)
				}
			</Disabled.Consumer>
		</div>
	);
};
