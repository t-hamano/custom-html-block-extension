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
import ItemHelp from '../components/item-help';

export default function MouseWheelZoom() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			mouseWheelZoom: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Ctrl + mouse wheel to zoom in / out', 'custom-html-block-extension' ) }
				checked={ editorOptions.mouseWheelZoom }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Ctrl + mouse wheel to zoom in / out', 'custom-html-block-extension' ) }
				isToggle
				defaultToggle={ false }
				image={ 'editor-options/mouse-wheel-zoom.gif' }
				value={ editorOptions.mouseWheelZoom }
			/>
		</div>
	);
}
