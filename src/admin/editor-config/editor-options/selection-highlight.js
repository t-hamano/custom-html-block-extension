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

export default function SelectionHighlight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			selectionHighlight: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __(
					'Highlight all occurrences of a selected word',
					'custom-html-block-extension'
				) }
				checked={ editorOptions.selectionHighlight }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __(
					'Highlight all occurrences of a selected word',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/selection-highlight_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/selection-highlight_2.jpg',
					},
				] }
				value={ editorOptions.selectionHighlight }
			/>
		</div>
	);
}
