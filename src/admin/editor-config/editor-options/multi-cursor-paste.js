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

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function MultiCursorPaste() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __(
		'Behavior when pasting text with matching line and cursor counts',
		'custom-html-block-extension'
	);
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Spread', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_1.gif',
			value: 'spread',
		},
		{
			label: __( 'Full', 'custom-html-block-extension' ),
			image: 'editor-options/multi-cursor-paste_2.gif',
			value: 'full',
			isDefault: true,
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorPaste: value,
		} );
	};

	return (
		<HStack justify="start" align="start" wrap>
			<ToggleGroupControl
				__nextHasNoMarginBottom
				size="__unstable-large"
				label={ title }
				value={ editorOptions.multiCursorPaste }
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
				value={ editorOptions.multiCursorPaste }
			/>
		</HStack>
	);
}
