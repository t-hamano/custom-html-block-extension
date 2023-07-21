/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function WrappingIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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
				label={ __( 'Word wrap indent', 'custom-html-block-extension' ) }
				value={ editorOptions.wrappingIndent }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Word wrap indent', 'custom-html-block-extension' ) }
				items={ items }
				value={ editorOptions.wrappingIndent }
			/>
		</div>
	);
}
