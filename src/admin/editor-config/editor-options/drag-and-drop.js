/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function DragAndDrop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			dragAndDrop: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Moving selections via drag and drop', 'custom-html-block-extension' ) }
				checked={ editorOptions.dragAndDrop }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Moving selections via drag and drop', 'custom-html-block-extension' ) }
				isToggle
				defaultToggle={ false }
				image={ 'editor-options/drag-and-drop.gif' }
				value={ editorOptions.dragAndDrop }
			/>
		</div>
	);
}
