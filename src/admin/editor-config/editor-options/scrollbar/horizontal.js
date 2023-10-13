/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarHorizontal() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor, searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Horizontal scrollbar', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Auto', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/horizontal_1.gif',
			value: 'auto',
			isDefault: true,
		},
		{
			label: __( 'Visible', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/horizontal_2.jpg',
			value: 'visible',
		},
		{
			label: __( 'Hidden', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/horizontal_3.jpg',
			value: 'hidden',
		},
	];

	const onChange = ( value ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				horizontal: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ editorOptions.scrollbar.horizontal }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.scrollbar.horizontal }
			/>
		</div>
	);
}
