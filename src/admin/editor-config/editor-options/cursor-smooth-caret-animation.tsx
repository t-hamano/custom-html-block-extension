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

export default function CursorSmoothCaretAnimation() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Cursor Smooth Caret Animation', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Enable', 'custom-html-block-extension' ),
			value: 'on',
			image: 'editor-options/cursor-smooth-caret-animation_1.gif',
			description: __( 'Smooth caret animation is always enabled.', 'custom-html-block-extension' ),
		},
		{
			label: __( 'Enable only when the cursor is moved explicitly', 'custom-html-block-extension' ),
			value: 'explicit',
			image: 'editor-options/cursor-smooth-caret-animation_2.gif',
			description: __(
				'Smooth caret animation is enabled only when the user moves the cursor with an explicit gesture.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/cursor-smooth-caret-animation_3.gif',
			isDefault: true,
		},
	];

	const selectItems = items.map( ( { label, value } ) => ( { label, value } ) );

	const onChange = ( value: EditorOptions[ 'cursorSmoothCaretAnimation' ] ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSmoothCaretAnimation: value,
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
				value={
					selectItems.find( ( item ) => item.value === editorOptions.cursorSmoothCaretAnimation ) ??
					null
				}
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'cursorSmoothCaretAnimation' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.cursorSmoothCaretAnimation }
			/>
		</Stack>
	);
}
