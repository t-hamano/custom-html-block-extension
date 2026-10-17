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

export default function AutoClosingDelete() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Auto Closing Delete', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always', 'custom-html-block-extension' ),
			value: 'always',
			image: 'editor-options/auto-closing-delete_1.gif',
			description: __(
				'Always remove adjacent closing quotes or brackets when deleting.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
			value: 'auto',
			isDefault: true,
			image: 'editor-options/auto-closing-delete_2.gif',
			description: __(
				'Remove adjacent closing quotes or brackets only if they were automatically inserted.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/auto-closing-delete_3.gif',
			description: __(
				'Never remove adjacent closing quotes or brackets when deleting.',
				'custom-html-block-extension'
			),
		},
	];

	const onChange = ( value: EditorOptions[ 'autoClosingDelete' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingDelete: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.autoClosingDelete ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'autoClosingDelete' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether the editor should remove adjacent closing quotes or brackets when deleting.',
					'custom-html-block-extension'
				) }
				items={ items }
				colCount="3"
				value={ editorOptions.autoClosingDelete }
			/>
		</Stack>
	);
}
