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
import { EditorConfigContext, useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function AutoIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Auto Indent', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	// Monaco also accepts 'full', but it only differs from 'advanced' with the
	// language's indentationRules, which none of the languages here define.
	const items = [
		{
			label: __( 'None', 'custom-html-block-extension' ),
			value: 'none',
			image: 'editor-options/auto-indent_1.gif',
			description: __(
				'The editor will not insert indentation automatically.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Keep', 'custom-html-block-extension' ),
			value: 'keep',
			image: 'editor-options/auto-indent_2.gif',
			description: __(
				"The editor will keep the current line's indentation.",
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Brackets', 'custom-html-block-extension' ),
			value: 'brackets',
			image: 'editor-options/auto-indent_3.gif',
			description: __(
				"The editor will keep the current line's indentation and honor language defined brackets.",
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Advanced', 'custom-html-block-extension' ),
			value: 'advanced',
			isDefault: true,
			image: 'editor-options/auto-indent_4.gif',
			description: __(
				"The editor will keep the current line's indentation, honor language defined brackets and apply language-specific rules when pressing Enter.",
				'custom-html-block-extension'
			),
		},
	];

	const onChange = ( value: EditorOptions[ 'autoIndent' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoIndent: value,
		} );
		onRefreshEditor();
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
				value={ items.find( ( item ) => item.value === editorOptions.autoIndent ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'autoIndent' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether the editor should automatically adjust the indentation when users type, paste, move or indent lines.',
					'custom-html-block-extension'
				) }
				items={ items }
				colCount="4"
				value={ editorOptions.autoIndent }
			/>
		</Stack>
	);
}
