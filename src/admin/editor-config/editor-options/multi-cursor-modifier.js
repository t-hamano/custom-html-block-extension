/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import {
	__experimentalHStack as HStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function MultiCursorModifier() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Multi cursor modifier key', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: isAppleOS()
				? __( 'Option', 'custom-html-block-extension' )
				: __( 'Alt', 'custom-html-block-extension' ),
			value: 'alt',
		},
		{
			label: isAppleOS()
				? __( 'Command', 'custom-html-block-extension' )
				: __( 'Ctrl', 'custom-html-block-extension' ),
			value: 'ctrlCmd',
			isDefault: true,
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorModifier: value,
		} );
	};

	return (
		<HStack justify="start" align="start" wrap>
			<ToggleGroupControl
				__nextHasNoMarginBottom
				size="__unstable-large"
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
					'You can use multiple cursors for faster editing. Sets the key for applying multiple cursors with modifier key + Click.',
					'custom-html-block-extension'
				) }
				image="editor-options/multi-cursor-modifier.gif"
			/>
		</HStack>
	);
}
