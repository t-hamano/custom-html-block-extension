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

	const title = __( 'Auto Closing Overtype', 'custom-html-block-extension' );
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
				'Always type over closing quotes or brackets.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
			value: 'auto',
			isDefault: true,
			image: 'editor-options/auto-closing-overtype_2.gif',
			description: __(
				'Type over closing quotes or brackets only if they were automatically inserted.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/auto-closing-overtype_3.gif',
			description: __(
				'Never type over closing quotes or brackets.',
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
				description={ __(
					'Controls whether the editor should type over closing quotes or brackets.',
					'custom-html-block-extension'
				) }
				items={ items }
				colCount="3"
				value={ editorOptions.autoClosingOvertype }
			/>
		</Stack>
	);
}
