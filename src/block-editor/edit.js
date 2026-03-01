/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useState, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	BlockControls,
	transformStyles,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	ResizableBox,
	ToolbarButton,
	Disabled,
	SandBox,
	ToolbarGroup,
	Modal,
	Notice,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { fullscreen } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import MonacoEditor from '../components/monaco-editor';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 1000;

const DEFAULT_STYLES = `
	html,body,:root {
		margin: 0 !important;
		padding: 0 !important;
		overflow: visible !important;
		min-height: auto !important;
	}
`;

export default function HTMLEdit( { attributes, isSelected, setAttributes, toggleSelection } ) {
	const { content, height } = attributes;
	const { editorSettings, editorOptions } = window.chbeObj;

	const [ isPreview, setIsPreview ] = useState();
	const [ isModalEditorOpen, setIsModalEditorOpen ] = useState();

	const [ errorMessage, setErrorMessage ] = useState();

	const ref = useRef();

	const settingStyles = useSelect(
		( select ) => select( blockEditorStore ).getSettings().styles,
		[]
	);

	const styles = useMemo(
		() => [
			DEFAULT_STYLES,
			...transformStyles( ( settingStyles ?? [] ).filter( ( style ) => style.css ) ),
		],
		[ settingStyles ]
	);

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
			<Disabled.Consumer>
				{ ( isDisabled ) =>
					isPreview || isDisabled ? (
						<>
							<SandBox html={ content } styles={ styles } />
							{ ! isSelected && <div className="block-library-html__preview-overlay"></div> }
						</>
					) : (
						<VStack>
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
									language="html"
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
						</VStack>
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
						language="html"
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
