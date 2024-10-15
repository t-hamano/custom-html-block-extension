/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import {
	__experimentalHStack as HStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import ItemHelp from '../../components/item-help';

export default function MinimapSide() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Position', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Left', 'custom-html-block-extension' ),
			image: 'editor-options/minimap/side_1.jpg',
			value: 'left',
		},
		{
			label: __( 'Right', 'custom-html-block-extension' ),
			image: 'editor-options/minimap/side_2.jpg',
			value: 'right',
			isDefault: true,
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				side: value,
			},
		} );
	};

	return (
		<HStack justify="start" align="start" wrap>
			<ToggleGroupControl
				__nextHasNoMarginBottom
				size="__unstable-large"
				label={ title }
				value={ editorOptions.minimap.side }
				onChange={ onChange }
				isBlock
			>
				{ items.map( ( item ) => (
					<ToggleGroupControlOption key={ item.value } value={ item.value } label={ item.label } />
				) ) }
			</ToggleGroupControl>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.minimap.side }
			/>
		</HStack>
	);
}
