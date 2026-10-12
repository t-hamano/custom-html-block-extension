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
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function FindSeedSearchStringFromSelection() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Seed search string from selection', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always', 'custom-html-block-extension' ),
			value: 'always',
			image: 'editor-options/find/seed-search-string-from-selection_1.gif',
			description: __(
				'Uses the selected text, or the word at the cursor if no text is selected.',
				'custom-html-block-extension'
			),
			isDefault: true,
		},
		{
			label: __( 'Only from selected text', 'custom-html-block-extension' ),
			value: 'selection',
			image: 'editor-options/find/seed-search-string-from-selection_2.gif',
			description: __(
				'Uses only the selected text. If no text is selected, the previous search string is kept.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/find/seed-search-string-from-selection_3.gif',
			description: __(
				'Does not use the selected text. The previous search string is kept.',
				'custom-html-block-extension'
			),
		},
	];

	const selectItems = items.map( ( { label, value } ) => ( { label, value } ) );

	const onChange = ( value: EditorOptions[ 'find' ][ 'seedSearchStringFromSelection' ] ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				seedSearchStringFromSelection: value,
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
				items={ selectItems }
				value={
					selectItems.find(
						( item ) => item.value === editorOptions.find.seedSearchStringFromSelection
					) ?? null
				}
				onValueChange={ ( item ) =>
					item &&
					onChange( item.value as EditorOptions[ 'find' ][ 'seedSearchStringFromSelection' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.find.seedSearchStringFromSelection }
				description={ __(
					'When the find widget is opened, the selected text or the word at the cursor is used as the search string.',
					'custom-html-block-extension'
				) }
			/>
		</Stack>
	);
}
