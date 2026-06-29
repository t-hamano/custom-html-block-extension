/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarHorizontal() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Horizontal scrollbar', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Auto', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/horizontal_1.gif',
			value: 'auto',
			isDefault: true,
		},
		{
			label: __( 'Visible', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/horizontal_2.jpg',
			value: 'visible',
		},
		{
			label: __( 'Hidden', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/horizontal_3.jpg',
			value: 'hidden',
		},
	] as const;

	const onChange = ( value: EditorOptions[ 'scrollbar' ][ 'horizontal' ] ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				horizontal: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl< EditorOptions[ 'scrollbar' ][ 'horizontal' ] >
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.scrollbar.horizontal }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					colCount="3"
					value={ editorOptions.scrollbar.horizontal }
				/>
			</HStack>
		</div>
	);
}
