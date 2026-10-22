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

export default function MinimapAutohide() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Autohide', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Minimap', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( "Don't hide", 'custom-html-block-extension' ),
			value: 'none',
			image: 'editor-options/minimap/autohide_1.jpg',
			description: __( 'The minimap is always shown.', 'custom-html-block-extension' ),
			isDefault: true,
		},
		{
			label: __( 'Show on mouseover', 'custom-html-block-extension' ),
			value: 'mouseover',
			image: 'editor-options/minimap/autohide_2.gif',
			description: __(
				'The minimap is hidden when mouse is not over the minimap and shown when mouse is over the minimap.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Show while scrolling', 'custom-html-block-extension' ),
			value: 'scroll',
			image: 'editor-options/minimap/autohide_3.gif',
			description: __(
				'The minimap is only shown when the editor is scrolled.',
				'custom-html-block-extension'
			),
		},
	];

	const onChange = ( value: EditorOptions[ 'minimap' ][ 'autohide' ] ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				autohide: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.minimap.autohide ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'minimap' ][ 'autohide' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether the minimap is hidden automatically.',
					'custom-html-block-extension'
				) }
				colCount="3"
				items={ items }
				value={ editorOptions.minimap.autohide }
			/>
		</Stack>
	);
}
