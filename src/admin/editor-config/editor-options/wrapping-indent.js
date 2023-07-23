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

export default function WrappingIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Word wrap indent', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'None', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_1.jpg',
			value: 'none',
			isDefault: true,
		},
		{
			label: __( 'Same', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_2.jpg',
			value: 'same',
		},
		{
			label: __( 'Indent', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_3.jpg',
			value: 'indent',
		},
		{
			label: __( 'Deep indent', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_4.jpg',
			value: 'deepIndent',
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			wrappingIndent: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ editorOptions.wrappingIndent }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.wrappingIndent }
			/>
		</div>
	);
}
