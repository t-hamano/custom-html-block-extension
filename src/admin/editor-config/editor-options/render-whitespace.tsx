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

export default function RenderWhitespace() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Render Whitespace', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'All', 'custom-html-block-extension' ),
			value: 'all',
			image: 'editor-options/render-whitespace_1.jpg',
		},
		{
			label: __(
				'Render whitespace other than single spaces between words',
				'custom-html-block-extension'
			),
			value: 'boundary',
			image: 'editor-options/render-whitespace_2.jpg',
		},
		{
			label: __( 'Render only whitespace in the selected text', 'custom-html-block-extension' ),
			value: 'selection',
			isDefault: true,
			image: 'editor-options/render-whitespace_3.jpg',
		},
		{
			label: __( 'Render only trailing whitespace', 'custom-html-block-extension' ),
			value: 'trailing',
			image: 'editor-options/render-whitespace_4.jpg',
		},
		{
			label: __( 'None', 'custom-html-block-extension' ),
			value: 'none',
			image: 'editor-options/render-whitespace_5.jpg',
		},
	];

	const onChange = ( value: EditorOptions[ 'renderWhitespace' ] ) => {
		setEditorOptions( {
			...editorOptions,
			renderWhitespace: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.renderWhitespace ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'renderWhitespace' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls how the editor should render whitespace characters.',
					'custom-html-block-extension'
				) }
				items={ items }
				value={ editorOptions.renderWhitespace }
			/>
		</Stack>
	);
}
