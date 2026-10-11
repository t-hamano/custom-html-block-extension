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

export default function OccurrencesHighlight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight matching tag', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Enable', 'custom-html-block-extension' ),
			value: 'singleFile',
			image: 'editor-options/occurrences-highlight_1.jpg',
			isDefault: true,
		},
		{
			label: __( 'Enable across all editors on the page', 'custom-html-block-extension' ),
			value: 'multiFile',
			image: 'editor-options/occurrences-highlight_1.jpg',
			description: __(
				'Also highlights matches in the other code editors on the same page, such as other Custom HTML blocks. This is an experimental feature of the editor.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/occurrences-highlight_2.jpg',
		},
	];

	const onChange = ( value: EditorOptions[ 'occurrencesHighlight' ] ) => {
		setEditorOptions( {
			...editorOptions,
			occurrencesHighlight: value,
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
				value={
					items.find( ( item ) => item.value === editorOptions.occurrencesHighlight ) ?? null
				}
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'occurrencesHighlight' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.occurrencesHighlight }
			/>
		</Stack>
	);
}
