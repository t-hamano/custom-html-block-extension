/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function CursorBlinking() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Cursor animation style', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
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
	] as const;

	const onChange = ( value: EditorOptions[ 'cursorBlinking' ] ) => {
		setEditorOptions( {
			...editorOptions,
			cursorBlinking: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl< EditorOptions[ 'cursorBlinking' ] >
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.cursorBlinking }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
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
		</div>
	);
}
