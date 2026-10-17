/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarVertical() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Vertical', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Scrollbar', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Auto', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/vertical_1.gif',
			value: 'auto',
			isDefault: true,
		},
		{
			label: __( 'Visible', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/vertical_2.jpg',
			value: 'visible',
		},
		{
			label: __( 'Hidden', 'custom-html-block-extension' ),
			image: 'editor-options/scrollbar/vertical_3.jpg',
			value: 'hidden',
		},
	];

	const onChange = ( value: EditorOptions[ 'scrollbar' ][ 'vertical' ] ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				vertical: value,
			},
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
				value={ items.find( ( item ) => item.value === editorOptions.scrollbar.vertical ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'scrollbar' ][ 'vertical' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls the visibility of the vertical scrollbar.',
					'custom-html-block-extension'
				) }
				items={ items }
				colCount="3"
				value={ editorOptions.scrollbar.vertical }
			/>
		</Stack>
	);
}
