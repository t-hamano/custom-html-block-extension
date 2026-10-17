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

export default function MinimapShowSlider() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Show Slider', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Minimap', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always show', 'custom-html-block-extension' ),
			value: 'always',
			image: 'editor-options/minimap/show-slider_1.jpg',
		},
		{
			label: __( 'Show on mouseover', 'custom-html-block-extension' ),
			value: 'mouseover',
			image: 'editor-options/minimap/show-slider_2.gif',
			isDefault: true,
		},
	];

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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SelectControl
				label={ title }
				items={ items }
				value={ items.find( ( item ) => item.value === editorOptions.minimap.showSlider ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'minimap' ][ 'showSlider' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.minimap.showSlider }
			/>
		</Stack>
	);
}
