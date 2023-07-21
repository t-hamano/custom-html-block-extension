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

export default function ScrollbarHorizontalHasArrows() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				horizontalHasArrows: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Show arrows on horizontal scrollbar', 'custom-html-block-extension' ) }
				checked={ editorOptions.scrollbar.horizontalHasArrows }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Show arrows on horizontal scrollbar', 'custom-html-block-extension' ) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/horizontal-has-arrows_1.jpg',
						value: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/horizontal-has-arrows_2.jpg',
						value: false,
						isDefault: true,
					},
				] }
				value={ editorOptions.scrollbar.horizontalHasArrows }
			/>
		</div>
	);
}
