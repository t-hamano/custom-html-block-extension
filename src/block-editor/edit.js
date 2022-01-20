/**
 * External dependencies
 */
import Editor from '@monaco-editor/react';
import webfontloader from 'webfontloader';
import { emmetHTML } from 'emmet-monaco-es';

/**
 * Internal dependencies
 */
import './style.scss';
import themes from 'themes';
import { toNumber } from 'common/helper';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import { PlainText, BlockControls, transformStyles, useBlockProps } from '@wordpress/block-editor';

import {
	ResizableBox,
	ToolbarButton,
	Disabled,
	SandBox,
	ToolbarGroup,
	Icon,
	Popover,
	BaseControl,
	ButtonGroup,
	Button,
	TextControl,
	Notice,
} from '@wordpress/components';

import { replace, arrowRight } from '@wordpress/icons';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 1000;

export default function HTMLEdit( { attributes, isSelected, setAttributes, toggleSelection } ) {
	const { content, height } = attributes;

	const [ isPreview, setIsPreview ] = useState();
	const [ useEditor, setUseEditor ] = useState( false );
	const [ isReplacing, setIsReplacing ] = useState( false );
	const [ replaceSetting, setReplaceSetting ] = useState( {
		beforeTabSize: chbeObj.editorSettings.tabSize,
		beforeInsertSpaces: chbeObj.editorSettings.insertSpaces,
		afterTabSize: chbeObj.editorSettings.tabSize,
		afterInsertSpaces: chbeObj.editorSettings.insertSpaces,
	} );

	let ownerDocument = null;
	const ref = useRef();

	useEffect( () => {
		// Enable the monaco editor only if it is not iframe editor instance.
		ownerDocument = ref.current.ownerDocument;
		setUseEditor( window.document === ownerDocument );
	}, [] );

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
			...transformStyles( select( 'core/block-editor' ).getSettings().styles ),
		];
	}, [] );

	const handleEditorDidMount = ( editor, monaco ) => {
		ownerDocument = ref.current.ownerDocument;

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

		editor.getModel().updateOptions( {
			tabSize: chbeObj.editorSettings.tabSize,
			insertSpaces: chbeObj.editorSettings.insertSpaces,
		} );

		// Load webfont.
		const font = chbeObj.fontFamily.find(
			( data ) => chbeObj.editorOptions.fontFamily === data.name
		);

		if ( undefined !== font && 'label' in font ) {
			const webfontConfig = {
				custom: {
					families: [ font.name ],
				},
			};

			if ( 'stylesheet' in font ) {
				webfontConfig.custom.urls = [ font.stylesheet ];
			}

			webfontloader.load( {
				timeout: 2000,
				...webfontConfig,
				active: () => {
					// Adjust the position of the cursor and space.
					monaco.editor.remeasureFonts();
				},
				context: ownerDocument.defaultView,
			} );
		}

		// Ctrl+X shortcut without a range selection will cut the block,
		// so catch the command and execute custom action instead.
		// eslint-disable-next-line no-bitwise
		editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_X, () => {
			const selection = editor.getSelection();
			const lineNumber = editor.getPosition().lineNumber;
			const isEmptySelection =
				selection.startLineNumber === selection.endLineNumber &&
				selection.startColumn === selection.endColumn;

			if ( chbeObj.editorOptions.emptySelectionClipboard ) {
				if ( isEmptySelection ) {
					// Select and cut the current line if there is no range selection and "Copy the current line without selection" is enabled.
					editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
					ownerDocument.execCommand( 'cut' );
				}
				ownerDocument.execCommand( 'cut' );
			} else if ( ! isEmptySelection ) {
				ownerDocument.execCommand( 'cut' );
			}
		} );

		// Ctrl+C shortcut without a range selection will copy the block,
		// so catch the command and execute custom action instead.
		// eslint-disable-next-line no-bitwise
		editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C, () => {
			const selection = editor.getSelection();
			const lineNumber = editor.getPosition().lineNumber;
			const isEmptySelection =
				selection.startLineNumber === selection.endLineNumber &&
				selection.startColumn === selection.endColumn;

			if ( chbeObj.editorOptions.emptySelectionClipboard ) {
				if ( isEmptySelection ) {
					// Select and cut the current line if there is no range selection and "Copy the current line without selection" is enabled.
					editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
					ownerDocument.execCommand( 'copy' );
				}
				ownerDocument.execCommand( 'copy' );
			} else if ( ! isEmptySelection ) {
				ownerDocument.execCommand( 'copy' );
			}
		} );
	};

	const handleResizeStart = () => {
		toggleSelection( false );
	};

	const handleResizeStop = ( event, direction, elt, delta ) => {
		const newHeight = Math.min(
			Math.max( parseInt( height + delta.height, 10 ), MIN_HEIGHT ),
			MAX_HEIGHT
		);
		setAttributes( { height: newHeight } );
	};

	const handleChangeContent = ( value ) => {
		setAttributes( { content: value } );
	};

	function changeIndent() {
		if ( undefined === content ) {
			setIsReplacing( false );
			return;
		}

		const lines = content.split( '\n' );
		let newLines = '';

		for ( let i = 0; i < lines.length; i++ ) {
			let spaces, indentCount, searchValue, newValue;

			if ( replaceSetting.beforeInsertSpaces ) {
				// From space indent
				spaces = lines[ i ].match( /^\s*/ )[ 0 ].length;
				indentCount = Math.floor( spaces / replaceSetting.beforeTabSize );
				searchValue = '\x20'.repeat( replaceSetting.beforeTabSize * indentCount );

				if ( replaceSetting.afterInsertSpaces ) {
					// To space indent
					newValue = '\x20'.repeat( replaceSetting.afterTabSize * indentCount );
				} else {
					// To tab indent
					newValue = '\t'.repeat( indentCount );
				}
			} else {
				// From tab indent
				spaces = lines[ i ].match( /^\t*/ )[ 0 ].length;
				searchValue = '\t'.repeat( spaces );

				if ( replaceSetting.afterInsertSpaces ) {
					// To space indent
					newValue = '\x20'.repeat( replaceSetting.afterTabSize * spaces );
				} else {
					// To tab indent (nothing)
					newValue = searchValue;
				}
			}

			const reg = new RegExp( '^' + searchValue );
			newLines += lines[ i ].replace( reg, newValue ) + ( i !== lines.length - 1 ? '\n' : '' );
		}

		setAttributes( { content: newLines } );
		setReplaceSetting( {
			...replaceSetting,
			beforeInsertSpaces: replaceSetting.afterInsertSpaces,
			beforeTabSize: replaceSetting.afterTabSize,
		} );
		setIsReplacing( false );
	}

	function switchToPreview() {
		setIsPreview( true );
	}

	function switchToHTML() {
		setIsPreview( false );
	}

	return (
		<div { ...useBlockProps( { ref, className: 'block-library-html__edit' } ) }>
			<BlockControls>
				{ useEditor && (
					<ToolbarGroup>
						<ToolbarButton
							icon={ replace }
							label={ __( 'Change Indentation', 'custom-html-block-extension' ) }
							onClick={ () => setIsReplacing( true ) }
						/>
						{ isReplacing && (
							<Popover className="chbe-popover" onClose={ () => setIsReplacing( false ) }>
								<h2 className="chbe-popover__ttl">
									{ __( 'Change Indentation', 'custom-html-block-extension' ) }
								</h2>
								<div className="chbe-popover__row">
									<div className="chbe-popover__col chbe-popover__col--setting">
										<h3 className="chbe-popover__subttl">
											{ __( 'Current Indent', 'custom-html-block-extension' ) }
										</h3>
										<BaseControl
											id="custom-html-block-extension/replace-indent-type"
											label={ __( 'Indent type', 'custom-html-block-extension' ) }
										>
											<ButtonGroup>
												<Button
													isPrimary={ ! replaceSetting.beforeInsertSpaces }
													isSmall
													onClick={ () => {
														setReplaceSetting( {
															...replaceSetting,
															beforeInsertSpaces: false,
														} );
													} }
												>
													{ __( 'Tab', 'custom-html-block-extension' ) }
												</Button>
												<Button
													isPrimary={ replaceSetting.beforeInsertSpaces }
													isSmall
													onClick={ () => {
														setReplaceSetting( {
															...replaceSetting,
															beforeInsertSpaces: true,
														} );
													} }
												>
													{ __( 'Space', 'custom-html-block-extension' ) }
												</Button>
											</ButtonGroup>
										</BaseControl>
										{ replaceSetting.beforeInsertSpaces && (
											<TextControl
												label={ __( 'Indent width', 'custom-html-block-extension' ) }
												value={ replaceSetting.beforeTabSize }
												type="number"
												min="1"
												max="8"
												onChange={ ( value ) => {
													setReplaceSetting( {
														...replaceSetting,
														beforeTabSize: value ? toNumber( value, 1, 8 ) : undefined,
													} );
												} }
											/>
										) }
									</div>
									<div className="chbe-popover__col chbe-popover__col--arrow">
										<Icon icon={ arrowRight } />
									</div>
									<div className="chbe-popover__col chbe-popover__col--setting">
										<h3 className="chbe-popover__subttl">
											{ __( 'New Indent', 'custom-html-block-extension' ) }
										</h3>
										<BaseControl
											id="custom-html-block-extension/replace-indent-type"
											label={ __( 'Indent type', 'custom-html-block-extension' ) }
										>
											<ButtonGroup>
												<Button
													isPrimary={ ! replaceSetting.afterInsertSpaces }
													isSmall
													onClick={ () => {
														setReplaceSetting( {
															...replaceSetting,
															afterInsertSpaces: false,
														} );
													} }
												>
													{ __( 'Tab', 'custom-html-block-extension' ) }
												</Button>
												<Button
													isPrimary={ replaceSetting.afterInsertSpaces }
													isSmall
													onClick={ () => {
														setReplaceSetting( {
															...replaceSetting,
															afterInsertSpaces: true,
														} );
													} }
												>
													{ __( 'Space', 'custom-html-block-extension' ) }
												</Button>
											</ButtonGroup>
										</BaseControl>
										{ replaceSetting.afterInsertSpaces && (
											<TextControl
												label={ __( 'Indent width', 'custom-html-block-extension' ) }
												value={ replaceSetting.afterTabSize }
												type="number"
												min="1"
												max="8"
												onChange={ ( value ) => {
													setReplaceSetting( {
														...replaceSetting,
														afterTabSize: value ? toNumber( value, 1, 8 ) : undefined,
													} );
												} }
											/>
										) }
									</div>
								</div>
								<div className="chbe-popover__buttons">
									<Button
										isPrimary
										disabled={
											( replaceSetting.beforeInsertSpaces &&
												replaceSetting.beforeTabSize === undefined ) ||
											( replaceSetting.afterInsertSpaces &&
												replaceSetting.afterTabSize === undefined )
										}
										onClick={ changeIndent }
									>
										{ __( 'Apply', 'custom-html-block-extension' ) }
									</Button>
									<Button isSecondary onClick={ () => setIsReplacing( false ) }>
										{ __( 'Cancel', 'custom-html-block-extension' ) }
									</Button>
								</div>
							</Popover>
						) }
					</ToolbarGroup>
				) }
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
							<SandBox html={ content } styles={ styles } />
							{ ! isSelected && <div className="block-library-html__preview-overlay"></div> }
						</>
					) : useEditor ? (
						<ResizableBox
							size={ { height } }
							minHeight={ MIN_HEIGHT }
							enable={ {
								top: false,
								right: false,
								bottom: true,
								left: false,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false,
							} }
							onResizeStart={ handleResizeStart }
							onResizeStop={ handleResizeStop }
							showHandle={ isSelected }
							__experimentalShowTooltip={ true }
						>
							<Editor
								theme={ chbeObj.editorSettings.theme }
								language="html"
								loading={ __( 'Loading…', 'custom-html-block-extension' ) }
								value={ content }
								options={ chbeObj.editorOptions }
								onChange={ handleChangeContent }
								onMount={ handleEditorDidMount }
							/>
						</ResizableBox>
					) : (
						<>
							<Notice status="error" isDismissible={ false }>
								{ __(
									'Custom HTML Block Extension cannot be used in this mode.',
									'custom-html-block-extension'
								) }
							</Notice>
							<PlainText
								value={ content }
								onChange={ handleChangeContent }
								placeholder={ __( 'Write HTML…' ) }
								aria-label={ __( 'HTML' ) }
							/>
						</>
					)
				}
			</Disabled.Consumer>
		</div>
	);
}
