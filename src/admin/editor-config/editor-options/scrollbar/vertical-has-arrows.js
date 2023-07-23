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
import { EditorConfigContext } from 'admin/editor-config';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function ScrollbarVerticalHasArrows() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const onChange = ( value ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				verticalHasArrows: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Show arrows on vertical scrollbar', 'custom-html-block-extension' ) }
				checked={ editorOptions.scrollbar.verticalHasArrows }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Show arrows on vertical scrollbar', 'custom-html-block-extension' ) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/vertical-has-arrows_1.jpg',
						value: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						image: 'editor-options/scrollbar/vertical-has-arrows_2.jpg',
						value: false,
						isDefault: true,
					},
				] }
				value={ editorOptions.scrollbar.verticalHasArrows }
			/>
		</div>
	);
}
