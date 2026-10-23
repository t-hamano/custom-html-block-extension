/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function MinimapShowSlider() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'minimap' ][ 'showSlider' ] ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				showSlider: value,
			},
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Show Slider', 'custom-html-block-extension' ) }
			group={ __( 'Minimap', 'custom-html-block-extension' ) }
			value={ editorOptions.minimap.showSlider }
			onChange={ onChange }
			defaultValue="mouseover"
			options={ [
				{
					label: __( 'Always show', 'custom-html-block-extension' ),
					value: 'always',
					image: 'editor-options/minimap/show-slider_1.jpg',
				},
				{
					label: __( 'Show on mouseover', 'custom-html-block-extension' ),
					value: 'mouseover',
					image: 'editor-options/minimap/show-slider_2.gif',
				},
			] }
			help={ {
				description: __(
					'Controls when the minimap slider is shown.',
					'custom-html-block-extension'
				),
				showOptions: true,
			} }
		/>
	);
}
