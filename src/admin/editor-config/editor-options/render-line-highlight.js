/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function RenderLineHighlight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Highlight current line', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
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
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			renderLineHighlight: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ editorOptions.renderLineHighlight }
				options={ [
					{
						label: __( 'Line numbers and the editor content', 'custom-html-block-extension' ),
						value: 'all',
					},
					{ label: __( 'Only the editor content', 'custom-html-block-extension' ), value: 'line' },
					{ label: __( 'Only line numbers', 'custom-html-block-extension' ), value: 'gutter' },
					{ label: __( 'None', 'custom-html-block-extension' ), value: 'none' },
				] }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.renderLineHighlight }
			/>
		</div>
	);
}
