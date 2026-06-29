/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

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
		<div className="chbe-admin-editor-config__setting-item">
			<Stack justify="start" align="start" wrap="wrap" gap="sm">
				<SelectControl< EditorOptions[ 'autoIndent' ] >
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.autoIndent }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
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
		</div>
	);
}
