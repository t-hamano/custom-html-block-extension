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

export default function RoundedSelection() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			roundedSelection: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Rounding corners of selection', 'custom-html-block-extension' ) }
				checked={ editorOptions.roundedSelection }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Rounding corners of selection', 'custom-html-block-extension' ) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/rounded-selection_1.jpg',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						isDefault: true,
						image: 'editor-options/rounded-selection_2.jpg',
					},
				] }
				value={ editorOptions.roundedSelection }
			/>
		</div>
	);
}
