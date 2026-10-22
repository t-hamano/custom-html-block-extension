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

export default function CursorStyle() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Cursor Style', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Line', 'custom-html-block-extension' ),
			value: 'line',
			isDefault: true,
			image: 'editor-options/cursor-style_1.jpg',
		},
		{
			label: __( 'Thin line', 'custom-html-block-extension' ),
			value: 'line-thin',
			image: 'editor-options/cursor-style_2.jpg',
		},
		{
			label: __( 'Block', 'custom-html-block-extension' ),
			value: 'block',
			image: 'editor-options/cursor-style_3.jpg',
		},
		{
			label: __( 'Outline', 'custom-html-block-extension' ),
			value: 'block-outline',
			image: 'editor-options/cursor-style_4.jpg',
		},
		{
			label: __( 'Underline', 'custom-html-block-extension' ),
			value: 'underline',
			image: 'editor-options/cursor-style_5.jpg',
		},
		{
			label: __( 'Thin underline', 'custom-html-block-extension' ),
			value: 'underline-thin',
			image: 'editor-options/cursor-style_6.jpg',
		},
	];

	const onChange = ( value: EditorOptions[ 'cursorStyle' ] ) => {
		setEditorOptions( {
			...editorOptions,
			cursorStyle: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.cursorStyle ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'cursorStyle' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __( 'Controls the cursor style.', 'custom-html-block-extension' ) }
				items={ items }
				colCount="3"
				value={ editorOptions.cursorStyle }
			/>
		</Stack>
	);
}
