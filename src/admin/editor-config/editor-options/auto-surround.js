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

export default function AutoSurround() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __(
		'Automatically surround selection with quotes or brackets',
		'custom-html-block-extension'
	);
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Quotes and brackets', 'custom-html-block-extension' ),
			value: 'languageDefined',
			isDefault: true,
			image: 'editor-options/auto-surround_1.gif',
		},
		{
			label: __( 'Quotes only', 'custom-html-block-extension' ),
			value: 'quotes',
			image: 'editor-options/auto-surround_2.gif',
		},
		{
			label: __( 'Brackets only', 'custom-html-block-extension' ),
			value: 'brackets',
			image: 'editor-options/auto-surround_3.gif',
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/auto-surround_4.gif',
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			autoSurround: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ editorOptions.autoSurround }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.autoSurround }
			/>
		</div>
	);
}
