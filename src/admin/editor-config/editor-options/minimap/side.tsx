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

export default function MinimapSide() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: string | number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				side: value as EditorOptions[ 'minimap' ][ 'side' ],
			},
		} );
	};

	return (
		<SettingItem
			control="toggleGroup"
			label={ __( 'Side', 'custom-html-block-extension' ) }
			group={ __( 'Minimap', 'custom-html-block-extension' ) }
			value={ editorOptions.minimap.side }
			onChange={ onChange }
			defaultValue="right"
			options={ [
				{
					label: __( 'Left', 'custom-html-block-extension' ),
					image: 'editor-options/minimap/side_1.jpg',
					value: 'left',
				},
				{
					label: __( 'Right', 'custom-html-block-extension' ),
					image: 'editor-options/minimap/side_2.jpg',
					value: 'right',
				},
			] }
			help={ {
				description: __(
					'Controls the side where to render the minimap.',
					'custom-html-block-extension'
				),
				showOptions: true,
			} }
		/>
	);
}
