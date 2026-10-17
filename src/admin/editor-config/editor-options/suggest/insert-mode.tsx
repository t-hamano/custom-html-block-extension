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

export default function SuggestInsertMode() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Insert Mode', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Suggest', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Insert', 'custom-html-block-extension' ),
			value: 'insert',
			isDefault: true,
			image: 'editor-options/suggest/insert-mode_1.gif',
			description: __(
				'Insert suggestion without overwriting text right of the cursor.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Replace', 'custom-html-block-extension' ),
			value: 'replace',
			image: 'editor-options/suggest/insert-mode_2.gif',
			description: __(
				'Insert suggestion and overwrite text right of the cursor.',
				'custom-html-block-extension'
			),
		},
	];

	const onChange = ( value: EditorOptions[ 'suggest' ][ 'insertMode' ] ) => {
		setEditorOptions( {
			...editorOptions,
			suggest: {
				...editorOptions.suggest,
				insertMode: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.suggest.insertMode ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'suggest' ][ 'insertMode' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="2"
				value={ editorOptions.suggest.insertMode }
			/>
		</Stack>
	);
}
