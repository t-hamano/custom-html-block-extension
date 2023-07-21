/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function RenderLineHighlightOnlyWhenFocus() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			renderLineHighlightOnlyWhenFocus: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __(
					'Highlight current line only the editor is focused',
					'custom-html-block-extension'
				) }
				checked={ editorOptions.renderLineHighlightOnlyWhenFocus }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __(
					'Highlight current line only the editor is focused',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/render-line-highlight-only-when-focus_1.gif',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/render-line-highlight-only-when-focus_2.gif',
						isDefault: true,
					},
				] }
				value={ editorOptions.renderLineHighlightOnlyWhenFocus }
			/>
		</div>
	);
}
