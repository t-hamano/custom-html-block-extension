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

export default function ShowFoldingControls() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Show code folding icon', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always show', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_1.jpg',
			value: 'always',
		},
		{
			label: __( 'Show on mouseover', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_2.gif',
			value: 'mouseover',
			isDefault: true,
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			showFoldingControls: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ editorOptions.showFoldingControls }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.showFoldingControls }
			/>
		</div>
	);
}
