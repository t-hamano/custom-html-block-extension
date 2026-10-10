/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { EditorConfigContext, useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';
import SelectControl from '../components/select-control';

export default function AutoIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Auto indent', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'None', 'custom-html-block-extension' ),
			value: 'none',
			image: 'editor-options/auto-indent_1.gif',
		},
		{
			label: __( 'Keep', 'custom-html-block-extension' ),
			value: 'keep',
			image: 'editor-options/auto-indent_2.gif',
		},
		{
			label: __( 'Advanced', 'custom-html-block-extension' ),
			value: 'advanced',
			isDefault: true,
			image: 'editor-options/auto-indent_3.gif',
		},
	] as const;

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
			<SelectControl< EditorOptions[ 'autoIndent' ] >
				label={ title }
				value={ editorOptions.autoIndent }
				options={ items }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.autoIndent }
			/>
		</Stack>
	);
}
