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
import { useSearchVisibility } from '../../index';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { Stack } from '@wordpress/ui';
import ItemHelp from '../../components/item-help';

export default function MinimapSide() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Position', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<ToggleGroupControl
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
		</Stack>
	);
}
