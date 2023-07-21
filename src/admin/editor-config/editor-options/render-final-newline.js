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

export default function RenderFinalNewline() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			renderFinalNewline: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __(
					'Render last line number when the file ends with a newline',
					'custom-html-block-extension'
				) }
				checked={ editorOptions.renderFinalNewline }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __(
					'Select the corresponding line when clicking on the line number',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/render-final-newline_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/render-final-newline_2.jpg',
					},
				] }
				value={ editorOptions.renderFinalNewline }
			/>
		</div>
	);
}
