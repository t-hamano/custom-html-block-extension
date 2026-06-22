/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarVertical() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Vertical scrollbar', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

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

	const onChange = ( value: string ) => {
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
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.scrollbar.vertical }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					colCount="3"
					value={ editorOptions.scrollbar.vertical }
				/>
			</HStack>
		</div>
	);
}
