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

export default function HideCursorInOverviewRuler() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			hideCursorInOverviewRuler: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Hide cursor position on scroll bar', 'custom-html-block-extension' ) }
				checked={ editorOptions.hideCursorInOverviewRuler }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Hide cursor position on scroll bar', 'custom-html-block-extension' ) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/hide-cursor-in-overview-ruler_1.jpg',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/hide-cursor-in-overview-ruler_2.jpg',
						isDefault: true,
					},
				] }
				value={ editorOptions.hideCursorInOverviewRuler }
			/>
		</div>
	);
}
