/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack, Text } from '@wordpress/ui';

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
			isDefault: true,
		},
		{
			label: __( 'Only from selected text', 'custom-html-block-extension' ),
			value: 'selection',
			image: 'editor-options/find/seed-search-string-from-selection_2.gif',
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/find/seed-search-string-from-selection_3.gif',
		},
	];

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
				items={ items }
				value={
					items.find(
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
				description={
					<>
						<Text render={ <p /> }>
							{ __(
								'When the find widget is opened, the selected text or the word at the cursor is used as the search string.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ __(
								'If "Only from selected text" is selected, only the selected text is used, and the word at the cursor is not.',
								'custom-html-block-extension'
							) }
						</Text>
					</>
				}
			/>
		</Stack>
	);
}
