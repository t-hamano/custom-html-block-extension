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

export default function MinimapSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'minimap' ][ 'size' ] ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				size: value,
			},
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Size', 'custom-html-block-extension' ) }
			group={ __( 'Minimap', 'custom-html-block-extension' ) }
			value={ editorOptions.minimap.size }
			onChange={ onChange }
			defaultValue="proportional"
			options={ [
				{
					label: __( "Same as editor's content", 'custom-html-block-extension' ),
					value: 'proportional',
					description: __(
						'The minimap has the same size as the editor contents (and might scroll).',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/size_1.jpg',
				},
				{
					label: __( 'Automatically zoom in or out', 'custom-html-block-extension' ),
					value: 'fill',
					description: __(
						'The minimap will stretch or shrink as necessary to fill the height of the editor (no scrolling).',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/size_2.jpg',
				},
				{
					label: __( 'Automatically shrink', 'custom-html-block-extension' ),
					value: 'fit',
					description: __(
						'The minimap will shrink as necessary to never be larger than the editor (no scrolling).',
						'custom-html-block-extension'
					),
					image: 'editor-options/minimap/size_3.jpg',
				},
			] }
			help={ {
				description: __( 'Controls the size of the minimap.', 'custom-html-block-extension' ),
				showOptions: true,
				colCount: 3,
			} }
		/>
	);
}
