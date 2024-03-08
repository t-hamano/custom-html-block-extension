/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { BlockControls, transformStyles, useBlockProps } from '@wordpress/block-editor';
import {
	ResizableBox,
	ToolbarButton,
	Disabled,
	SandBox,
	ToolbarGroup,
	Icon,
	BaseControl,
	ButtonGroup,
	Button,
	TextControl,
	Dropdown,
	Modal,
	Notice,
} from '@wordpress/components';
import { fullscreen, arrowRight, replace } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import { toNumber } from '../lib/helper';
import MonacoEditor from '../components/monaco-editor';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 1000;

const INDENT_TYPES = [
	{
		label: __( 'Tab', 'custom-html-block-extension' ),
		value: false,
	},
	{
		label: __( 'Space', 'custom-html-block-extension' ),
		value: true,
	},
];

export default function HTMLEdit( { attributes, isSelected, setAttributes, toggleSelection } ) {
	const { content, height } = attributes;
	const { editorSettings, editorOptions } = window.chbeObj;

	const [ isPreview, setIsPreview ] = useState();
	const [ isModalEditorOpen, setIsModalEditorOpen ] = useState();

	const [ replaceSetting, setReplaceSetting ] = useState( {
		beforeTabSize: editorSettings.tabSize,
		beforeInsertSpaces: editorSettings.insertSpaces,
		afterTabSize: editorSettings.tabSize,
		afterInsertSpaces: editorSettings.insertSpaces,
	} );
	const [ errorMessage, setErrorMessage ] = useState();

	const ref = useRef();

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

	const onResizeStart = () => {
		toggleSelection( false );
	};

	const onResizeStop = ( event, direction, elt, delta ) => {
		const newHeight = Math.min(
			Math.max( parseInt( height + delta.height, 10 ), MIN_HEIGHT ),
			MAX_HEIGHT
		);
		setAttributes( { height: newHeight } );
	};

	const onChange = ( value ) => {
		setAttributes( { content: value } );
	};

	const onError = ( error ) => {
		if ( ( error.type === 'timeout' || error.type === 'scripterror' ) && error.msg ) {
			setErrorMessage( error.msg );
		}
	};

	// Convert tab size and insert spaces.
	function changeIndent( onClose ) {
		if ( undefined === content ) {
			onClose();
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

		onClose();
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
				{ ! isPreview && (
					<ToolbarGroup>
						<ToolbarButton
							icon={ fullscreen }
							label={ __( 'Open HTML editor', 'custom-html-block-extension' ) }
							onClick={ () => setIsModalEditorOpen( true ) }
						/>
						<Dropdown
							contentClassName="chbe-popover"
							renderToggle={ ( { isOpen, onToggle } ) => {
								return (
									<ToolbarButton
										icon={ replace }
										label={ __( 'Change indentation', 'custom-html-block-extension' ) }
										aria-expanded={ isOpen }
										onClick={ onToggle }
									/>
								);
							} }
							renderContent={ ( { onClose } ) => (
								<div className="chbe-popover__inner">
									<h2 className="chbe-popover__title">
										{ __( 'Change indentation', 'custom-html-block-extension' ) }
									</h2>
									<div className="chbe-popover__row">
										<div className="chbe-popover__col">
											<h3 className="chbe-popover__subtitle">
												{ __( 'Current indent', 'custom-html-block-extension' ) }
											</h3>
											<BaseControl>
												<BaseControl.VisualLabel>
													{ __( 'Current indent type', 'custom-html-block-extension' ) }
												</BaseControl.VisualLabel>
												<ButtonGroup
													aria-label={ __( 'Current indent type', 'custom-html-block-extension' ) }
												>
													{ INDENT_TYPES.map( ( indentType, index ) => (
														<Button
															key={ index }
															variant={
																indentType.value === replaceSetting.beforeInsertSpaces
																	? 'primary'
																	: undefined
															}
															onClick={ () => {
																setReplaceSetting( {
																	...replaceSetting,
																	beforeInsertSpaces: indentType.value,
																} );
															} }
															size="compact"
														>
															{ indentType.label }
														</Button>
													) ) }
												</ButtonGroup>
											</BaseControl>
											{ replaceSetting.beforeInsertSpaces && (
												<TextControl
													label={ __( 'Current indent width', 'custom-html-block-extension' ) }
													value={ replaceSetting.beforeTabSize || '' }
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
										<Icon className="chbe-popover__arrow" icon={ arrowRight } />
										<div className="chbe-popover__col">
											<h3 className="chbe-popover__subtitle">
												{ __( 'New indent', 'custom-html-block-extension' ) }
											</h3>
											<BaseControl>
												<BaseControl.VisualLabel>
													{ __( 'New indent type', 'custom-html-block-extension' ) }
												</BaseControl.VisualLabel>
												<ButtonGroup
													aria-label={ __( 'New indent type', 'custom-html-block-extension' ) }
												>
													{ INDENT_TYPES.map( ( indentType, index ) => (
														<Button
															key={ index }
															variant={
																indentType.value === replaceSetting.afterInsertSpaces
																	? 'primary'
																	: undefined
															}
															onClick={ () => {
																setReplaceSetting( {
																	...replaceSetting,
																	afterInsertSpaces: indentType.value,
																} );
															} }
															size="compact"
														>
															{ indentType.label }
														</Button>
													) ) }
												</ButtonGroup>
											</BaseControl>
											{ replaceSetting.afterInsertSpaces && (
												<TextControl
													label={ __( 'New indent width', 'custom-html-block-extension' ) }
													value={ replaceSetting.afterTabSize || '' }
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
											variant="primary"
											disabled={
												( replaceSetting.beforeInsertSpaces &&
													replaceSetting.beforeTabSize === undefined ) ||
												( replaceSetting.afterInsertSpaces &&
													replaceSetting.afterTabSize === undefined )
											}
											onClick={ () => changeIndent( onClose ) }
											size="compact"
											__experimentalIsFocusable
										>
											{ __( 'Apply', 'custom-html-block-extension' ) }
										</Button>
										<Button variant="secondary" onClick={ onClose } size="compact">
											{ __( 'Cancel', 'custom-html-block-extension' ) }
										</Button>
									</div>
								</div>
							) }
						/>
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
					) : (
						<>
							{ errorMessage && <Notice status="warning">{ errorMessage }</Notice> }
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
								onResizeStart={ onResizeStart }
								onResizeStop={ onResizeStop }
								showHandle={ isSelected }
							>
								<MonacoEditor
									className="chbe-editor-wrapper"
									language={ 'html' }
									loading={ __( 'Loading…', 'custom-html-block-extension' ) }
									theme={ editorSettings.theme }
									options={ editorOptions }
									value={ content }
									useEmmet={ editorSettings.emmet }
									tabSize={ editorSettings.tabSize }
									insertSpaces={ editorSettings.insertSpaces }
									onChange={ onChange }
									onError={ onError }
								/>
							</ResizableBox>
						</>
					)
				}
			</Disabled.Consumer>
			{ isModalEditorOpen && (
				<Modal
					title={ __( 'HTML editor', 'custom-html-block-extension' ) }
					className="chbe-fullscreen-editor"
					isFullScreen
					onRequestClose={ () => setIsModalEditorOpen( false ) }
				>
					<MonacoEditor
						className="chbe-editor-wrapper"
						language={ 'html' }
						loading={ __( 'Loading…', 'custom-html-block-extension' ) }
						theme={ editorSettings.theme }
						options={ editorOptions }
						value={ content }
						useEmmet={ editorSettings.emmet }
						tabSize={ editorSettings.tabSize }
						insertSpaces={ editorSettings.insertSpaces }
						onChange={ onChange }
						onError={ onError }
					/>
				</Modal>
			) }
		</div>
	);
}
