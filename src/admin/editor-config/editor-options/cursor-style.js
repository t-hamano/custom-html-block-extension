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

export default function CursorStyle() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const items = [
		{
			label: __( 'Line', 'custom-html-block-extension' ),
			value: 'line',
			isDefault: true,
			image: 'editor-options/cursor-style_1.jpg',
		},
		{
			label: __( 'Thin line', 'custom-html-block-extension' ),
			value: 'line-thin',
			image: 'editor-options/cursor-style_2.jpg',
		},
		{
			label: __( 'Block', 'custom-html-block-extension' ),
			value: 'block',
			image: 'editor-options/cursor-style_3.jpg',
		},
		{
			label: __( 'Outline', 'custom-html-block-extension' ),
			value: 'block-outline',
			image: 'editor-options/cursor-style_4.jpg',
		},
		{
			label: __( 'Underline', 'custom-html-block-extension' ),
			value: 'underline',
			image: 'editor-options/cursor-style_5.jpg',
		},
		{
			label: __( 'Thin underline', 'custom-html-block-extension' ),
			value: 'underline-thin',
			image: 'editor-options/cursor-style_6.jpg',
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorStyle: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Cursor style', 'custom-html-block-extension' ) }
				value={ editorOptions.cursorStyle }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Size', 'custom-html-block-extension' ) }
				items={ items }
				colCount="3"
				value={ editorOptions.cursorStyle }
			/>
		</div>
	);
}
