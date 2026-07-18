/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useState, useRef } from '@wordpress/element';
import { useSelect, useDispatch, useRegistry } from '@wordpress/data';
import * as blockEditor from '@wordpress/block-editor';
import {
	BlockControls,
	BlockIcon,
	transformStyles,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { parse, serialize, getBlockContent } from '@wordpress/blocks';
import {
	ResizableBox,
	ToolbarButton,
	SandBox,
	ToolbarGroup,
	Modal,
	Notice,
	Placeholder,
} from '@wordpress/components';
import { Stack } from '@wordpress/ui';
import { code, fullscreen } from '@wordpress/icons';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/private-apis';
import type { Block, BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import MonacoEditor, { type MonacoError } from '../components/monaco-editor';

// Opt in to the `@wordpress/block-editor` private APIs to access `InnerContent`,
// which renders a Custom HTML block's embedded inner blocks as editable blocks.
// This is a private API with no backward-compatibility guarantee: the consent
// string and `InnerContent` itself may change or be removed in any WordPress
// release.
const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules(
	'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.',
	'@wordpress/block-editor'
);

const { InnerContent } = unlock(
	( blockEditor as unknown as { privateApis: unknown } ).privateApis
) as { InnerContent: React.ComponentType< { clientId: string } > };

type HTMLEditProps = BlockEditProps< {
	content: string;
	height: number;
} > & {
	// Injected by the block editor but not included in BlockEditProps.
	toggleSelection: ( isSelectionEnabled: boolean ) => void;
};

// The parsed block carries `innerContent` (static HTML fragments interleaved
// with `null` markers for inner block positions), which the installed
// `@wordpress/blocks` types don't yet expose on `Block`.
type BlockWithInnerContent = Block & {
	innerContent?: Array< string | null >;
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
	clientId,
	attributes,
	isSelected,
	setAttributes,
	toggleSelection,
}: HTMLEditProps ) {
	const { height } = attributes;
	const { editorSettings, editorOptions } = window.chbeObj;

	const [ isPreview, setIsPreview ] = useState< boolean >();
	const [ isModalEditorOpen, setIsModalEditorOpen ] = useState< boolean >();

	const [ errorMessage, setErrorMessage ] = useState< string >();

	const ref = useRef< HTMLDivElement >( null );

	const registry = useRegistry();
	const { updateBlock, replaceInnerBlocks } = useDispatch( blockEditorStore );

	const { content, hasInnerBlocks } = useSelect(
		( select ) => {
			const block = select( blockEditorStore ).getBlock( clientId );
			return {
				content: block ? getBlockContent( block ) : '',
				hasInnerBlocks: ( block?.innerBlocks?.length ?? 0 ) > 0,
			};
		},
		[ clientId ]
	);

	const { settingStyles, isPreviewMode } = useSelect( ( select ) => {
		const settings = select( blockEditorStore ).getSettings();
		return {
			settingStyles: settings.styles,
			isPreviewMode: ( settings as { isPreviewMode?: boolean } ).isPreviewMode,
		};
	}, [] );

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

	// Re-parse the edited content: static HTML becomes the block's
	// `innerContent` fragments and `<!-- wp:* -->` delimited segments become
	// inner blocks mounted at their positions within the static markup.
	const onChange = ( nextContent: string ) => {
		if ( nextContent === content ) {
			return;
		}

		const [ parsedBlock ] = parse(
			`<!-- wp:html -->\n${ nextContent }\n<!-- /wp:html -->`
		) as BlockWithInnerContent[];
		const nextInnerBlocks = parsedBlock?.innerBlocks ?? [];
		const prevInnerBlocks = registry.select( blockEditorStore ).getBlocks( clientId );
		// Keep the existing inner blocks, and thereby their client IDs and
		// selection, when their markup is unchanged — e.g. when only the
		// surrounding static HTML was edited.
		const innerBlocksUnchanged =
			prevInnerBlocks.length === nextInnerBlocks.length &&
			prevInnerBlocks.every(
				( block: Block, index: number ) =>
					serialize( block ) === serialize( nextInnerBlocks[ index ] )
			);

		registry.batch( () => {
			updateBlock( clientId, {
				innerContent: parsedBlock?.innerContent ?? ( nextContent ? [ nextContent ] : [] ),
			} as Partial< Block > );
			if ( ! innerBlocksUnchanged ) {
				replaceInnerBlocks( clientId, nextInnerBlocks, false );
			}
		} );
	};

	// Migrate the deprecated `content` attribute. The block's markup now lives
	// in its inner content, but a block created via `createBlock( 'core/html',
	// { content } )` still arrives with a `content` attribute. As soon as it
	// loads, move that markup into the block's inner content and clear the
	// attribute.
	useEffect( () => {
		if ( ! attributes.content ) {
			return;
		}

		updateBlock( clientId, {
			attributes: { content: undefined },
			innerContent: [ attributes.content ],
		} as Partial< Block > );
	}, [ clientId, updateBlock, attributes.content ] );

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

	function renderPreview() {
		if ( ! content?.trim() ) {
			return (
				<Placeholder
					icon={ <BlockIcon icon={ code } /> }
					label={ __( 'Custom HTML', 'custom-html-block-extension' ) }
					instructions={ __(
						'Add custom HTML code and preview how it looks.',
						'custom-html-block-extension'
					) }
				/>
			);
		}
		// Render editable inner blocks in place, but only in the user-toggled
		// preview — not in the read-only preview mode, where nothing should be
		// interactive.
		if ( hasInnerBlocks && isPreview && ! isPreviewMode ) {
			return <InnerContent clientId={ clientId } />;
		}
		return (
			<>
				<SandBox html={ content } styles={ styles } />
				{ ! isSelected && <div className="block-library-html__preview-overlay"></div> }
			</>
		);
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
			{ isPreview || isPreviewMode ? (
				renderPreview()
			) : (
				<Stack direction="column" gap="sm">
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
				</Stack>
			) }
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
