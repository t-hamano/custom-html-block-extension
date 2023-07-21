/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { ToggleControl } from '@wordpress/components';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function MinimapRenderCharacters() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				renderCharacters: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Displays actual characters', 'custom-html-block-extension' ) }
				checked={ editorOptions.minimap.renderCharacters }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Displays actual characters', 'custom-html-block-extension' ) }
				description={ __(
					'By default, the minimap shows blocks. You can change this to show actual characters.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						description: __( 'Show characters.', 'custom-html-block-extension' ),
						image: 'editor-options/minimap/render-characters_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						description: __( 'Show blocks.', 'custom-html-block-extension' ),
						image: 'editor-options/minimap/render-characters_2.jpg',
					},
				] }
				value={ editorOptions.minimap.renderCharacters }
			/>
		</div>
	);
}
