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

	const title = __( 'Wrapping Indent', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'None', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_1.jpg',
			description: __(
				'No indentation. Wrapped lines begin at column 1.',
				'custom-html-block-extension'
			),
			value: 'none',
		},
		{
			label: __( 'Same', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_2.jpg',
			description: __(
				'Wrapped lines get the same indentation as the parent.',
				'custom-html-block-extension'
			),
			value: 'same',
			isDefault: true,
		},
		{
			label: __( 'Indent', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_3.jpg',
			description: __(
				'Wrapped lines get +1 indentation toward the parent.',
				'custom-html-block-extension'
			),
			value: 'indent',
		},
		{
			label: __( 'Deep indent', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_4.jpg',
			description: __(
				'Wrapped lines get +2 indentation toward the parent.',
				'custom-html-block-extension'
			),
			value: 'deepIndent',
		},
	];

	const selectItems = items.map( ( { label, value } ) => ( { label, value } ) );

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
				items={ selectItems }
				value={
					selectItems.find( ( item ) => item.value === editorOptions.wrappingIndent ) ?? null
				}
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'wrappingIndent' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls the indentation of wrapped lines.',
					'custom-html-block-extension'
				) }
				items={ items }
				value={ editorOptions.wrappingIndent }
			/>
		</Stack>
	);
}
