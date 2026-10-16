/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { Stack } from '@wordpress/ui';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function MultiCursorModifier() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Multi Cursor Modifier', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: isAppleOS()
				? __( 'Option', 'custom-html-block-extension' )
				: __( 'Alt', 'custom-html-block-extension' ),
			value: 'alt',
			isDefault: true,
		},
		{
			label: isAppleOS()
				? __( 'Command', 'custom-html-block-extension' )
				: __( 'Ctrl', 'custom-html-block-extension' ),
			value: 'ctrlCmd',
		},
	];

	const onChange = ( value: string | number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorModifier: value as typeof editorOptions.multiCursorModifier,
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
				label={ title }
				value={ editorOptions.multiCursorModifier }
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
				description={ __(
					'The modifier to be used to add multiple cursors with the mouse. The Go to Definition and Open Link mouse gestures will adapt such that they do not conflict with the multicursor modifier.',
					'custom-html-block-extension'
				) }
				image="editor-options/multi-cursor-modifier.gif"
			/>
		</Stack>
	);
}
