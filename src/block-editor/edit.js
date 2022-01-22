/**
 * Internal dependencies
 */
import './style.scss';
import { toNumber } from 'lib/helper';
import MonacoEditor from 'components/monaco-editor';

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
	Notice,
} from '@wordpress/components';
import { replace, arrowRight } from '@wordpress/icons';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 1000;

export default function HTMLEdit( { attributes, isSelected, setAttributes, toggleSelection } ) {
	const { content, height } = attributes;
	const { editorSettings, editorOptions } = chbeObj;

	const [ isPreview, setIsPreview ] = useState();
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

	const handleOnChange = ( value ) => {
		setAttributes( { content: value } );
	};

	const handleOnError = ( error ) => {
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
				<Dropdown
					renderToggle={ ( { isOpen, onToggle } ) => {
						return (
							<ToolbarButton
								icon={ replace }
								label={ __( 'Change Indentation', 'custom-html-block-extension' ) }
								aria-expanded={ isOpen }
								onClick={ onToggle }
							/>
						);
					} }
					renderContent={ ( { onClose } ) => (
						<div className="chbe-popover">
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
									onClick={ () => changeIndent( onClose ) }
								>
									{ __( 'Apply', 'custom-html-block-extension' ) }
								</Button>
								<Button isSecondary onClick={ onClose }>
									{ __( 'Cancel', 'custom-html-block-extension' ) }
								</Button>
							</div>
						</div>
					) }
				/>
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
								onResizeStart={ handleResizeStart }
								onResizeStop={ handleResizeStop }
								showHandle={ isSelected }
							>
								<MonacoEditor
									className="monaco-editor-wrapper"
									language={ 'html' }
									loading={ __( 'Loading…', 'custom-html-block-extension' ) }
									theme={ editorSettings.theme }
									options={ editorOptions }
									value={ content }
									useEmmet={ editorSettings.emmet }
									tabSize={ editorSettings.tabSize }
									insertSpaces={ editorSettings.insertSpaces }
									onChange={ handleOnChange }
									onError={ handleOnError }
								/>
							</ResizableBox>
						</>
					)
				}
			</Disabled.Consumer>
		</div>
	);
}
