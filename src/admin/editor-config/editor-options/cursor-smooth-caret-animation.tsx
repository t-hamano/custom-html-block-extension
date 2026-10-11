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

	const title = __( 'Smooth cursor animation', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Enable', 'custom-html-block-extension' ),
			value: 'on',
			image: 'editor-options/cursor-smooth-caret-animation_1.gif',
		},
		{
			label: __( 'Enable only when the cursor is moved explicitly', 'custom-html-block-extension' ),
			value: 'explicit',
			image: 'editor-options/cursor-smooth-caret-animation_3.gif',
			description: __(
				'Animates the cursor when it is moved with the keyboard or mouse, but not while typing.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/cursor-smooth-caret-animation_2.gif',
			isDefault: true,
		},
	];

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
				items={ items }
				value={
					items.find( ( item ) => item.value === editorOptions.cursorSmoothCaretAnimation ) ?? null
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
