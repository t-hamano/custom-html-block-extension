/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function CursorBlinking() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Cursor animation style', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Blink', 'custom-html-block-extension' ),
			value: 'blink',
			isDefault: true,
			image: 'editor-options/cursor-blinking_1.gif',
		},
		{
			label: __( 'Smooth', 'custom-html-block-extension' ),
			value: 'smooth',
			image: 'editor-options/cursor-blinking_2.gif',
		},
		{
			label: __( 'Phase', 'custom-html-block-extension' ),
			value: 'phase',
			image: 'editor-options/cursor-blinking_3.gif',
		},
		{
			label: __( 'Expand', 'custom-html-block-extension' ),
			value: 'expand',
			image: 'editor-options/cursor-blinking_4.gif',
		},
		{
			label: __( 'Solid', 'custom-html-block-extension' ),
			value: 'solid',
			image: 'editor-options/cursor-blinking_5.jpg',
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorBlinking: value,
		} );
	};

	return (
		<HStack justify="start" align="start" wrap>
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ title }
				value={ editorOptions.cursorBlinking }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="5"
				value={ editorOptions.cursorBlinking }
			/>
		</HStack>
	);
}
