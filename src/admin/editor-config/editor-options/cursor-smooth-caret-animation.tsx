/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function CursorSmoothCaretAnimation() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'cursorSmoothCaretAnimation' ] ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSmoothCaretAnimation: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Cursor Smooth Caret Animation', 'custom-html-block-extension' ) }
			value={ editorOptions.cursorSmoothCaretAnimation }
			onChange={ onChange }
			defaultValue="off"
			options={ [
				{
					label: __( 'Enable', 'custom-html-block-extension' ),
					value: 'on',
					image: 'editor-options/cursor-smooth-caret-animation_1.gif',
					description: __(
						'Smooth caret animation is always enabled.',
						'custom-html-block-extension'
					),
				},
				{
					label: __(
						'Enable only when the cursor is moved explicitly',
						'custom-html-block-extension'
					),
					value: 'explicit',
					image: 'editor-options/cursor-smooth-caret-animation_2.gif',
					description: __(
						'Smooth caret animation is enabled only when the user moves the cursor with an explicit gesture.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Disable', 'custom-html-block-extension' ),
					value: 'off',
					image: 'editor-options/cursor-smooth-caret-animation_3.gif',
					description: __( 'Smooth caret animation is disabled.', 'custom-html-block-extension' ),
				},
			] }
			help={ {
				description: __(
					'Controls whether the smooth caret animation should be enabled.',
					'custom-html-block-extension'
				),
				showOptions: true,
				colCount: 3,
			} }
		/>
	);
}
