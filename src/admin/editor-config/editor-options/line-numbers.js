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

export default function LineNumbers() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Show line numbers', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Hide', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/line-numbers_1.jpg',
		},
		{
			label: __( 'Show', 'custom-html-block-extension' ),
			value: 'on',
			image: 'editor-options/line-numbers_2.jpg',
			isDefault: true,
		},
		{
			label: __( 'Show number of lines to cursor position', 'custom-html-block-extension' ),
			value: 'relative',
			image: 'editor-options/line-numbers_3.gif',
		},
		{
			label: __( 'Show every 10 lines', 'custom-html-block-extension' ),
			value: 'interval',
			image: 'editor-options/line-numbers_4.gif',
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbers: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ editorOptions.lineNumbers }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="4"
				value={ editorOptions.lineNumbers }
			/>
		</div>
	);
}
