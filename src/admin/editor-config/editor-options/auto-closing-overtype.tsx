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

export default function AutoClosingOvertype() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Type over closing brackets and quotes', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always', 'custom-html-block-extension' ),
			value: 'always',
			image: 'editor-options/auto-closing-overtype_1.gif',
			description: __(
				'Typing a closing bracket or quote right before the same character moves the cursor past it instead of adding another one.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
			value: 'auto',
			isDefault: true,
			image: 'editor-options/auto-closing-overtype_2.gif',
			description: __(
				'Typing a closing bracket or quote types over the one next to the cursor only if the editor inserted it automatically.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/auto-closing-overtype_3.gif',
			description: __(
				'Typing a closing bracket or quote always adds a new character.',
				'custom-html-block-extension'
			),
		},
	];

	const onChange = ( value: EditorOptions[ 'autoClosingOvertype' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingOvertype: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.autoClosingOvertype ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'autoClosingOvertype' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.autoClosingOvertype }
			/>
		</Stack>
	);
}
