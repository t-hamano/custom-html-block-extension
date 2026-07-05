/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function RenderLineHighlight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight current line', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Line numbers and the editor content', 'custom-html-block-extension' ),
			value: 'all',
			isDefault: true,
			image: 'editor-options/render-line-highlight_1.jpg',
		},
		{
			label: __( 'Only the editor content', 'custom-html-block-extension' ),
			value: 'line',
			image: 'editor-options/render-line-highlight_2.jpg',
		},
		{
			label: __( 'Only line numbers', 'custom-html-block-extension' ),
			value: 'gutter',
			image: 'editor-options/render-line-highlight_3.jpg',
		},
		{
			label: __( 'None', 'custom-html-block-extension' ),
			value: 'none',
			image: 'editor-options/render-line-highlight_4.jpg',
		},
	] as const;

	const onChange = ( value: EditorOptions[ 'renderLineHighlight' ] ) => {
		setEditorOptions( {
			...editorOptions,
			renderLineHighlight: value,
		} );
	};

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SelectControl< EditorOptions[ 'renderLineHighlight' ] >
				__next40pxDefaultSize
				label={ title }
				value={ editorOptions.renderLineHighlight }
				options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.renderLineHighlight }
			/>
		</Stack>
	);
}
