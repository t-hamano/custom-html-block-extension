/**
 * External dependencies
 */
import type { ComponentType, ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { createContext, useContext, useEffect, useMemo, useState } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useBlockProps, store as blockEditorStore } from '@wordpress/block-editor';
import {
	getBlockAttributes,
	getBlockContent,
	getBlockType,
	getSaveContent,
	validateBlock,
} from '@wordpress/blocks';
import type { Block } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import MonacoEditor from '../components/monaco-editor';

type BlockListBlockProps = {
	clientId: string;
	mode: string;
};

type BlockEditProps = {
	clientId: string;
	name: string;
};

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 500;

// `__unstableIsHtml` is missing from the package types.
const useHtmlBlockProps = useBlockProps as unknown as (
	props: Record< string, unknown >,
	options: { __unstableIsHtml: boolean }
) => Record< string, unknown >;

// Client ID of the block that is in the HTML mode.
const HtmlModeContext = createContext< string | null >( null );

function BlockHTMLWrapper( { children }: { children: ReactNode } ) {
	return <div { ...useHtmlBlockProps( {}, { __unstableIsHtml: true } ) }>{ children }</div>;
}

// Monaco version of `BlockHTML` in `@wordpress/block-editor`.
function BlockHTML( { clientId }: { clientId: string } ) {
	const { editorSettings } = window.chbeObj;
	const { updateBlock } = useDispatch( blockEditorStore );
	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const blockContent = useMemo( () => ( block ? getBlockContent( block ) : '' ), [ block ] );
	const [ html, setHtml ] = useState( blockContent );
	const [ height, setHeight ] = useState( MIN_HEIGHT );

	// The editor resizes to fit its content, so it must not add space below the last line.
	const options = useMemo(
		() => ( { ...window.chbeObj.editorOptions, scrollBeyondLastLine: false } ),
		[]
	);

	useEffect( () => {
		setHtml( blockContent );
	}, [ blockContent ] );

	const onBlur = ( nextHtml: string ) => {
		if ( ! block || nextHtml === blockContent ) {
			return;
		}

		const blockType = getBlockType( block.name );
		if ( ! blockType ) {
			return;
		}

		const attributes = getBlockAttributes( blockType, nextHtml, block.attributes );

		// If the HTML is empty, reset the block to the default HTML.
		const content = nextHtml ? nextHtml : getSaveContent( blockType, attributes );
		const [ isValid ] = nextHtml
			? validateBlock( { ...block, attributes, originalContent: content } as Block )
			: [ true ];

		updateBlock( clientId, {
			attributes,
			originalContent: content,
			isValid,
		} as Partial< Block > );

		if ( ! nextHtml ) {
			setHtml( content );
		}
	};

	return (
		<div style={ { height } }>
			<MonacoEditor
				language="html"
				theme={ editorSettings.theme }
				options={ options }
				value={ html }
				useEmmet={ editorSettings.emmet }
				tabSize={ editorSettings.tabSize }
				insertSpaces={ editorSettings.insertSpaces }
				onChange={ setHtml }
				onBlur={ onBlur }
				onContentHeightChange={ ( contentHeight ) =>
					setHeight( Math.min( Math.max( contentHeight, MIN_HEIGHT ), MAX_HEIGHT ) )
				}
			/>
		</div>
	);
}

/**
 * Render the block in the visual mode so that `BlockEdit` is rendered instead
 * of the core `BlockHTML`.
 */
export const withBlockHTMLListBlock = createHigherOrderComponent(
	( BlockListBlock: ComponentType< BlockListBlockProps > ) => ( props: BlockListBlockProps ) => {
		const isHtmlMode = props.mode === 'html';
		return (
			<HtmlModeContext.Provider value={ isHtmlMode ? props.clientId : null }>
				<BlockListBlock { ...props } mode={ isHtmlMode ? 'visual' : props.mode } />
			</HtmlModeContext.Provider>
		);
	},
	'withBlockHTMLListBlock'
);

/**
 * Render the Monaco editor in the HTML mode, as `BlockListBlock` does with the
 * core `BlockHTML`.
 */
export const withBlockHTMLEdit = createHigherOrderComponent(
	( BlockEdit: ComponentType< BlockEditProps > ) => ( props: BlockEditProps ) => {
		const htmlModeClientId = useContext( HtmlModeContext );
		if ( htmlModeClientId !== props.clientId ) {
			return <BlockEdit { ...props } />;
		}

		// Core already wraps blocks with API version 1 with the block props.
		const needsBlockWrapper = ( getBlockType( props.name )?.apiVersion ?? 1 ) > 1;
		const blockHTML = <BlockHTML clientId={ props.clientId } />;

		return (
			<>
				{ /* Render the edit component so the inspector controls don't disappear. */ }
				<div style={ { display: 'none' } }>
					<BlockEdit { ...props } />
				</div>
				{ needsBlockWrapper ? <BlockHTMLWrapper>{ blockHTML }</BlockHTMLWrapper> : blockHTML }
			</>
		);
	},
	'withBlockHTMLEdit'
);
