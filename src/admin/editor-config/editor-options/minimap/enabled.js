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

export default function MinimapEnabled() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				enabled: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Enable minimap', 'custom-html-block-extension' ) }
				checked={ editorOptions.minimap.enabled }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Enable minimap', 'custom-html-block-extension' ) }
				description={ __(
					'Minimap gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. You can click or drag the shaded area to quickly jump to different sections.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle={ true }
				image={ 'editor-options/minimap/enabled.gif' }
				value={ editorOptions.minimap.enabled }
			/>
		</div>
	);
}
