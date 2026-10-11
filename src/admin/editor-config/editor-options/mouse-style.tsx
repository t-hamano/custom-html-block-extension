/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function MouseStyle() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Mouse pointer style', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Text', 'custom-html-block-extension' ),
			value: 'text',
			isDefault: true,
			image: 'editor-options/mouse-style_1.jpg',
		},
		{
			label: __( 'Default', 'custom-html-block-extension' ),
			value: 'default',
			image: 'editor-options/mouse-style_2.jpg',
		},
		{
			label: __( 'Copy', 'custom-html-block-extension' ),
			value: 'copy',
			image: 'editor-options/mouse-style_3.jpg',
		},
	];

	const onChange = ( value: EditorOptions[ 'mouseStyle' ] ) => {
		setEditorOptions( {
			...editorOptions,
			mouseStyle: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.mouseStyle ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'mouseStyle' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.mouseStyle }
			/>
		</Stack>
	);
}
