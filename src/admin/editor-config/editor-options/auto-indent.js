/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { EditorConfigContext } from 'admin/editor-config';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function AutoIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

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
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			autoIndent: value,
		} );
		onRefreshEditor();
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Auto indent', 'custom-html-block-extension' ) }
				value={ editorOptions.autoIndent }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Auto indent', 'custom-html-block-extension' ) }
				items={ items }
				colCount="3"
				value={ editorOptions.autoIndent }
			/>
		</div>
	);
}
