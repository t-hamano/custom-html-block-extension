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

export default function Hover() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Enable hover hints', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			hover: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl label={ title } checked={ editorOptions.hover } onChange={ onChange } />
			<ItemHelp
				onChange={ onChange }
				title={ title }
				isToggle
				defaultToggle
				image={ 'editor-options/hover.gif' }
				value={ editorOptions.hover }
			/>
		</div>
	);
}
