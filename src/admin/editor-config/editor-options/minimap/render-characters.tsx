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

export default function MinimapRenderCharacters() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				renderCharacters: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Render Characters', 'custom-html-block-extension' ) }
			group={ __( 'Minimap', 'custom-html-block-extension' ) }
			value={ editorOptions.minimap.renderCharacters }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					description: __( 'Show characters.', 'custom-html-block-extension' ),
					image: 'editor-options/minimap/render-characters_1.jpg',
				},
				{
					value: false,
					description: __( 'Show blocks.', 'custom-html-block-extension' ),
					image: 'editor-options/minimap/render-characters_2.jpg',
				},
			] }
			help={ {
				description: __(
					'Render the actual characters on a line as opposed to color blocks.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
