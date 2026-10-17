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

export default function RenderFinalNewline() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Render Final Newline', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Enable', 'custom-html-block-extension' ),
			value: 'on',
			image: 'editor-options/render-final-newline_1.jpg',
			isDefault: true,
		},
		{
			label: __( 'Dimmed', 'custom-html-block-extension' ),
			value: 'dimmed',
			image: 'editor-options/render-final-newline_2.jpg',
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/render-final-newline_3.jpg',
		},
	];

	const onChange = ( value: EditorOptions[ 'renderFinalNewline' ] ) => {
		setEditorOptions( {
			...editorOptions,
			renderFinalNewline: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.renderFinalNewline ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'renderFinalNewline' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Render last line number when the file ends with a newline.',
					'custom-html-block-extension'
				) }
				items={ items }
				colCount="3"
				value={ editorOptions.renderFinalNewline }
			/>
		</Stack>
	);
}
