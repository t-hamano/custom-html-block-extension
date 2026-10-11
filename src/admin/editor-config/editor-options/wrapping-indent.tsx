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

export default function WrappingIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Word wrap indent', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'None', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_1.jpg',
			value: 'none',
			isDefault: true,
		},
		{
			label: __( 'Same', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_2.jpg',
			value: 'same',
		},
		{
			label: __( 'Indent', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_3.jpg',
			value: 'indent',
		},
		{
			label: __( 'Deep indent', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_4.jpg',
			value: 'deepIndent',
		},
	];

	const onChange = ( value: EditorOptions[ 'wrappingIndent' ] ) => {
		setEditorOptions( {
			...editorOptions,
			wrappingIndent: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.wrappingIndent ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'wrappingIndent' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.wrappingIndent }
			/>
		</Stack>
	);
}
