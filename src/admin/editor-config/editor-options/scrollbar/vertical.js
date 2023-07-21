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

export default function ScrollbarVertical() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const items = [
		{
			label: __( 'Auto', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/vertical_1.gif',
			value: 'auto',
			isDefault: true,
		},
		{
			label: __( 'Visible', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/vertical_2.jpg',
			value: 'visible',
		},
		{
			label: __( 'Hidden', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/vertical_3.jpg',
			value: 'hidden',
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				vertical: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Vertical scrollbar', 'custom-html-block-extension' ) }
				value={ editorOptions.scrollbar.vertical }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Vertical scrollbar', 'custom-html-block-extension' ) }
				items={ items }
				colCount="3"
				value={ editorOptions.scrollbar.vertical }
			/>
		</div>
	);
}
