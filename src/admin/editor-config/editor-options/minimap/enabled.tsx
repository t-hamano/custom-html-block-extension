/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function MinimapEnabled() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				enabled: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Minimap', 'custom-html-block-extension' ) }
			group="minimap"
			value={ editorOptions.minimap.enabled }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __( 'Controls whether the minimap is shown.', 'custom-html-block-extension' ),
				image: 'editor-options/minimap/enabled.gif',
			} }
		/>
	);
}
