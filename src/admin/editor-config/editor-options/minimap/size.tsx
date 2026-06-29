/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function MinimapSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Size', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( "Same as editor's content", 'custom-html-block-extension' ),
			value: 'proportional',
			isDefault: true,
			description: __(
				'Minimap size is the same as the contents (which may scroll) .',
				'custom-html-block-extension'
			),
			image: 'editor-options/minimap/size_1.jpg',
		},
		{
			label: __( 'Automatically zoom in or out', 'custom-html-block-extension' ),
			value: 'fill',
			description: __(
				'Minimap will zoom in or out as needed (not scroll) .',
				'custom-html-block-extension'
			),
			image: 'editor-options/minimap/size_2.jpg',
		},
		{
			label: __( 'Automatically shrink', 'custom-html-block-extension' ),
			value: 'fit',
			description: __(
				'Minimap will shrink as needed (not scroll) .',
				'custom-html-block-extension'
			),
			image: 'editor-options/minimap/size_3.jpg',
		},
	] as const;

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
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl< EditorOptions[ 'minimap' ][ 'size' ] >
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.minimap.size }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					colCount="3"
					value={ editorOptions.minimap.size }
				/>
			</HStack>
		</div>
	);
}
