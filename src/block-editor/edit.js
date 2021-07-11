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
	useBlockProps
} from '@wordpress/block-editor';

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
	TextControl
} from '@wordpress/components';

import {
	replace,
	arrowRight
} from '@wordpress/icons';

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
	const [ isReplacing, setIsReplacing ] = useState( false );
	const [ replaceSetting, setReplaceSetting ] = useState({
		beforeTabSize: chbeObj.editorSettings.tabSize,
		beforeInsertSpaces: chbeObj.editorSettings.insertSpaces,
		afterTabSize: chbeObj.editorSettings.tabSize,
		afterInsertSpaces: chbeObj.editorSettings.insertSpaces
	});

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
			const selection = editor.getSelection();
			const lineNumber = editor.getPosition().lineNumber;
			const isEmptySelection = selection.startLineNumber === selection.endLineNumber && selection.startColumn === selection.endColumn;

			if ( chbeObj.editorOptions.emptySelectionClipboard ) {
				if ( isEmptySelection ) {

					// Select and cut the current line if there is no range selection and "Copy the current line without selection" is enabled.
					editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
					document.execCommand( 'cut' );
				}
				document.execCommand( 'cut' );
			} else if ( ! isEmptySelection ) {
				document.execCommand( 'cut' );
			}
		});

		// Ctrl+C shortcut without a range selection will copy the block,
		// so catch the command and execute custom action instead.
		editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_C, () => {
			const selection = editor.getSelection();
			const lineNumber = editor.getPosition().lineNumber;
			const isEmptySelection = selection.startLineNumber === selection.endLineNumber && selection.startColumn === selection.endColumn;

			if ( chbeObj.editorOptions.emptySelectionClipboard ) {
				if ( isEmptySelection ) {

					// Select and cut the current line if there is no range selection and "Copy the current line without selection" is enabled.
					editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
					document.execCommand( 'copy' );
				}
				document.execCommand( 'copy' );
			} else if ( ! isEmptySelection ) {
				document.execCommand( 'copy' );
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

	function changeIndent() {

		const lines = content.split( '\n' );
		let newLines = '';

		for ( let i = 0; i < lines.length; i++ ) {
			let spaces, indentCount, searchValue, newValue;

			if ( replaceSetting.beforeInsertSpaces ) {

				// From space indent
				spaces = lines[i].match( /^\s*/ )[0].length;
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
				spaces = lines[i].match( /^\t*/ )[0].length;
				searchValue = '\t'.repeat( spaces );

				if ( replaceSetting.afterInsertSpaces ) {

					// To space indent
					newValue = '\x20'.repeat( replaceSetting.afterTabSize * spaces );
				} else {

					// To tab indent (nothing)
					newValue = searchValue;
				}
			}

			let reg = new RegExp( '^' + searchValue  );
			newLines += lines[i].replace( reg, newValue ) + ( i != lines.length - 1 ? '\n' : '' );
		}

		setAttributes({ content: newLines });
		setReplaceSetting({
			...replaceSetting,
			beforeInsertSpaces: replaceSetting.afterInsertSpaces,
			beforeTabSize: replaceSetting.afterTabSize
		});
		setIsReplacing( false );
	};

	function switchToPreview() {
		setIsPreview( true );
	}

	function switchToHTML()  {
		setIsPreview( false );
	}

	return (
		<div { ...useBlockProps({ className: 'block-library-html__edit' }) }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
							icon={ replace }
							label={ __( 'Change Indentation', 'custom-html-block-extension' ) }
							onClick={ () => setIsReplacing( true ) }
					/>
					{isReplacing && (
						<Popover
							className="components-inline-color-popover"
							onClose={ () => setIsReplacing( false ) }
						>
							<div className="chbe-popover">
								<h2 className="chbe-popover__ttl">{ __( 'Change Indentation', 'custom-html-block-extension' ) }</h2>
								<div className="chbe-popover__row">
									<div className="chbe-popover__col chbe-popover__col--setting">
										<h3 className="chbe-popover__subttl">{ __( 'Current Indent', 'custom-html-block-extension' ) }</h3>
										<BaseControl
											id="custom-html-block-extension/replace-indent-type"
											label={ __( 'Indent type', 'custom-html-block-extension' ) }
										>
											<ButtonGroup>
												<Button
													isPrimary={ ! replaceSetting.beforeInsertSpaces }
													isSmall
													onClick={ () => {
														setReplaceSetting({
															...replaceSetting,
															beforeInsertSpaces: false
														});
													}}
												>
													{ __( 'Tab', 'custom-html-block-extension' ) }
												</Button>
												<Button
													isPrimary={ replaceSetting.beforeInsertSpaces }
													isSmall
													onClick={ () => {
														setReplaceSetting({
															...replaceSetting,
															beforeInsertSpaces: true
														});
													}}
												>
													{ __( 'Space', 'custom-html-block-extension' ) }
												</Button>
											</ButtonGroup>
										</BaseControl>
										{replaceSetting.beforeInsertSpaces && (
											<TextControl
												label={ __( 'Indent width', 'custom-html-block-extension' ) }
												value={ replaceSetting.beforeTabSize }
												type="number"
												min="1"
												max="8"
												onChange={ ( value ) => {
													setReplaceSetting({
														...replaceSetting,
														beforeTabSize: value
													});
												}}
											/>
										)}
									</div>
									<div className="chbe-popover__col chbe-popover__col--arrow">
										<Icon icon={ arrowRight } />
									</div>
									<div className="chbe-popover__col chbe-popover__col--setting">
										<h3 className="chbe-popover__subttl">{ __( 'New Indent', 'custom-html-block-extension' ) }</h3>
										<BaseControl
											id="custom-html-block-extension/replace-indent-type"
											label={ __( 'Indent type', 'custom-html-block-extension' ) }
										>
											<ButtonGroup>
												<Button
													isPrimary={ ! replaceSetting.afterInsertSpaces }
													isSmall
													onClick={ () => {
														setReplaceSetting({
															...replaceSetting,
															afterInsertSpaces: false
														});
													}}
												>
													{ __( 'Tab', 'custom-html-block-extension' ) }
												</Button>
												<Button
													isPrimary={ replaceSetting.afterInsertSpaces }
													isSmall
													onClick={ () => {
														setReplaceSetting({
															...replaceSetting,
															afterInsertSpaces: true
														});
													}}
												>
													{ __( 'Space', 'custom-html-block-extension' ) }
												</Button>
											</ButtonGroup>
										</BaseControl>
										{replaceSetting.afterInsertSpaces && (
											<TextControl
												label={ __( 'Indent width', 'custom-html-block-extension' ) }
												value={ replaceSetting.afterTabSize }
												type="number"
												min="1"
												max="8"
												onChange={ ( value ) => {
													setReplaceSetting({
														...replaceSetting,
														afterTabSize: value
													});
												}}
											/>
										)}
									</div>
								</div>
								<Button
									className="chbe-popover__submit"
									isPrimary={ true }
									onClick={ changeIndent }
								>
									{ __( 'Apply', 'custom-html-block-extension' ) }
								</Button>
							</div>
						</Popover>
					)}
				</ToolbarGroup>
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
