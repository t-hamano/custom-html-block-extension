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

export default function RenderWhitespace() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Rendering of whitespace', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'All', 'custom-html-block-extension' ),
			value: 'all',
			isDefault: true,
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
	] as const;

	const onChange = ( value: EditorOptions[ 'renderWhitespace' ] ) => {
		setEditorOptions( {
			...editorOptions,
			renderWhitespace: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl< EditorOptions[ 'renderWhitespace' ] >
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.renderWhitespace }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					value={ editorOptions.renderWhitespace }
				/>
			</HStack>
		</div>
	);
}
