/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function Folding() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Enable code folding', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			folding: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl label={ title } checked={ editorOptions.folding } onChange={ onChange } />
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'You can fold regions of source code using the folding icons between line numbers and line start. Move the mouse over the folding icon and click to fold and unfold regions. Use Shift + Click on the folding icon to fold or unfold the region and all regions inside.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image={ 'editor-options/folding.gif' }
				value={ editorOptions.folding }
			/>
		</div>
	);
}
