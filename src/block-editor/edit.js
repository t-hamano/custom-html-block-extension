/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import {
	ResizableBox,
	ToolbarButton,
	ToolbarGroup,
	Button,
	TextControl,
	Dropdown,
	Modal,
	Flex,
	FlexBlock,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	Notice,
} from '@wordpress/components';
import { fullscreen, replace, seen } from '@wordpress/icons';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import './style.scss';
import { toNumber } from '../lib/helper';
import TabEditor from './tab-editor';
import HTMLPreview from './html-preview';

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
	const { editorSettings } = window.chbeObj;

	const [ isPreview, setIsPreview ] = useState();
	const [ isModalEditorOpen, setIsModalEditorOpen ] = useState();
	const [ isModalPreviewOpen, setIsModalPreviewOpen ] = useState();
	const [ replaceSetting, setReplaceSetting ] = useState( {
		beforeTabSize: editorSettings.tabSize,
		beforeInsertSpaces: editorSettings.insertSpaces,
		afterTabSize: editorSettings.tabSize,
		afterInsertSpaces: editorSettings.insertSpaces,
	} );
	const [ errorMessage, setErrorMessage ] = useState();

	const ref = useRef();
	const isLargeViewport = useViewportMatch( 'medium' );

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
								<VStack align="center" spacing={ 4 }>
									<Heading as="h2" level="4">
										{ __( 'Change indentation', 'custom-html-block-extension' ) }
									</Heading>
									<HStack align="start">
										<VStack spacing={ 4 } className="chbe-popover__col">
											<Heading as="h3" level="5" className="chbe-popover__subtitle">
												{ __( 'Current indent', 'custom-html-block-extension' ) }
											</Heading>
											<ToggleGroupControl
												__nextHasNoMarginBottom
												size="__unstable-large"
												label={ __( 'Indent type', 'custom-html-block-extension' ) }
												value={ replaceSetting.beforeInsertSpaces }
												onChange={ ( value ) => {
													setReplaceSetting( {
														...replaceSetting,
														beforeInsertSpaces: value,
													} );
												} }
												isBlock
											>
												{ INDENT_TYPES.map( ( indentType ) => (
													<ToggleGroupControlOption
														key={ indentType.value }
														value={ indentType.value }
														label={ indentType.label }
													/>
												) ) }
											</ToggleGroupControl>
											{ replaceSetting.beforeInsertSpaces && (
												<TextControl
													__next40pxDefaultSize
													__nextHasNoMarginBottom
													label={ __( 'Indent width', 'custom-html-block-extension' ) }
													value={ replaceSetting.beforeTabSize || '' }
													type="number"
													min={ 1 }
													max={ 8 }
													onChange={ ( value ) => {
														setReplaceSetting( {
															...replaceSetting,
															beforeTabSize: value ? toNumber( value, 1, 8 ) : undefined,
														} );
													} }
												/>
											) }
										</VStack>
										<VStack spacing={ 4 } className="chbe-popover__col">
											<Heading as="h3" level="5" className="chbe-popover__subtitle">
												{ __( 'New indent', 'custom-html-block-extension' ) }
											</Heading>
											<ToggleGroupControl
												__nextHasNoMarginBottom
												size="__unstable-large"
												label={ __( 'Indent type', 'custom-html-block-extension' ) }
												value={ replaceSetting.afterInsertSpaces }
												onChange={ ( value ) => {
													setReplaceSetting( {
														...replaceSetting,
														afterInsertSpaces: value,
													} );
												} }
												isBlock
											>
												{ INDENT_TYPES.map( ( indentType ) => (
													<ToggleGroupControlOption
														key={ indentType.value }
														value={ indentType.value }
														label={ indentType.label }
													/>
												) ) }
											</ToggleGroupControl>
											{ replaceSetting.afterInsertSpaces && (
												<TextControl
													__next40pxDefaultSize
													__nextHasNoMarginBottom
													label={ __( 'Indent width', 'custom-html-block-extension' ) }
													value={ replaceSetting.afterTabSize || '' }
													type="number"
													min={ 1 }
													max={ 8 }
													onChange={ ( value ) => {
														setReplaceSetting( {
															...replaceSetting,
															afterTabSize: value ? toNumber( value, 1, 8 ) : undefined,
														} );
													} }
												/>
											) }
										</VStack>
									</HStack>
									<HStack justify="center">
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
									</HStack>
								</VStack>
							) }
						/>
					</ToolbarGroup>
				) }
				<ToolbarGroup>
					<ToolbarButton isPressed={ ! isPreview } onClick={ switchToHTML }>
						{ __( 'HTML', 'custom-html-block-extension' ) }
					</ToolbarButton>
					<ToolbarButton isPressed={ isPreview } onClick={ switchToPreview }>
						{ __( 'Preview', 'custom-html-block-extension' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			{ errorMessage && (
				<Notice status="warning" isDismissible={ false }>
					{ errorMessage }
				</Notice>
			) }
			{ isPreview ? (
				<HTMLPreview content={ content } isSelected={ isSelected } />
			) : (
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
					<TabEditor content={ content } onChange={ onChange } onError={ onError } />
				</ResizableBox>
			) }
			{ isModalEditorOpen && (
				<Modal
					title={ __( 'Custom HTML', 'custom-html-block-extension' ) }
					className="chbe-fullscreen-editor"
					isFullScreen
					onRequestClose={ () => setIsModalEditorOpen( false ) }
					headerActions={
						isLargeViewport && (
							<Button
								size="compact"
								icon={ seen }
								isPressed={ isModalPreviewOpen }
								label={
									isModalPreviewOpen
										? __( 'Hide preview', 'custom-html-block-extension' )
										: __( 'Show preview', 'custom-html-block-extension' )
								}
								onClick={ () => setIsModalPreviewOpen( ! isModalPreviewOpen ) }
							/>
						)
					}
				>
					<Flex style={ { height: '100%' } } align="stretch" gap={ 4 }>
						<FlexBlock style={ { height: '100%' } }>
							<TabEditor content={ content } onChange={ onChange } onError={ onError } />
						</FlexBlock>
						{ isModalPreviewOpen && (
							<FlexBlock>
								<VStack spacing={ 8 }>
									<Heading as="h2" level="4">
										{ __( 'HTML Preview', 'custom-html-block-extension' ) }
									</Heading>
									<HTMLPreview content={ content } isSelected={ isSelected } />
								</VStack>
							</FlexBlock>
						) }
					</Flex>
				</Modal>
			) }
		</div>
	);
}
