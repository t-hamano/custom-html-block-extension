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

export default function MinimapShowSlider() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const items = [
		{
			label: __( 'Always show', 'custom-html-block-extension' ),
			value: 'always',
			image: 'editor-options/minimap/show-slider_1.jpg',
		},
		{
			label: __( 'Show on mouseover', 'custom-html-block-extension' ),
			value: 'mouseover',
			image: 'editor-options/minimap/show-slider_2.gif',
			isDefault: true,
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				showSlider: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Show slider', 'custom-html-block-extension' ) }
				value={ editorOptions.minimap.showSlider }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Show slider', 'custom-html-block-extension' ) }
				items={ items }
				value={ editorOptions.minimap.showSlider }
			/>
		</div>
	);
}
