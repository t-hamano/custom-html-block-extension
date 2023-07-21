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

export default function CursorSmoothCaretAnimation() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSmoothCaretAnimation: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Enable smooth cursor animation', 'custom-html-block-extension' ) }
				checked={ editorOptions.cursorSmoothCaretAnimation }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Enable smooth cursor animation', 'custom-html-block-extension' ) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/cursor-smooth-caret-animation_1.gif',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/cursor-smooth-caret-animation_2.gif',
						isDefault: true,
					},
				] }
				value={ editorOptions.cursorSmoothCaretAnimation }
			/>
		</div>
	);
}
