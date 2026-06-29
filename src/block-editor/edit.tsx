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
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import MonacoEditor, { type MonacoError } from '../components/monaco-editor';

type HTMLEditProps = BlockEditProps< {
	content: string;
	height: number;
} > & {
	// Injected by the block editor but not included in BlockEditProps.
	toggleSelection: ( isSelectionEnabled: boolean ) => void;
};

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

export default function HTMLEdit( {
	attributes,
	isSelected,
	setAttributes,
	toggleSelection,
}: HTMLEditProps ) {
	const { content, height } = attributes;
	const { editorSettings, editorOptions } = window.chbeObj;

	const [ isPreview, setIsPreview ] = useState< boolean >();
	const [ isModalEditorOpen, setIsModalEditorOpen ] = useState< boolean >();

	const [ errorMessage, setErrorMessage ] = useState< string >();

	const ref = useRef< HTMLDivElement >( null );

	const settingStyles = useSelect(
		( select ) => select( blockEditorStore ).getSettings().styles,
		[]
	);

	const styles = useMemo(
		() => [
			DEFAULT_STYLES,
			...transformStyles(
				( settingStyles ?? [] ).filter( ( style: { css?: string } ) => style.css )
			),
		],
		[ settingStyles ]
	);

	const onResizeStart = () => {
		toggleSelection( false );
	};

	const onResizeStop = (
		_event: unknown,
		_direction: unknown,
		_elt: unknown,
		delta: { height: number }
	) => {
		const newHeight = Math.min(
			Math.max( parseInt( `${ height + delta.height }`, 10 ), MIN_HEIGHT ),
			MAX_HEIGHT
		);
		setAttributes( { height: newHeight } );
	};

	const onChange = ( value: string ) => {
		setAttributes( { content: value } );
	};

	const onError = ( error: MonacoError ) => {
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
