/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack } from '@wordpress/ui';

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
	];

	const selectItems = items.map( ( { label, value } ) => ( { label, value } ) );

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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SelectControl
				label={ title }
				items={ selectItems }
				value={ selectItems.find( ( item ) => item.value === editorOptions.minimap.size ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'minimap' ][ 'size' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.minimap.size }
			/>
		</Stack>
	);
}
