/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function CursorBlinking() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'cursorBlinking' ] ) => {
		setEditorOptions( {
			...editorOptions,
			cursorBlinking: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			name="cursorBlinking"
			label={ __( 'Cursor Blinking', 'custom-html-block-extension' ) }
			value={ editorOptions.cursorBlinking }
			onChange={ onChange }
			defaultValue="blink"
			options={ [
				{
					label: _x( 'Blink', 'setting option label', 'custom-html-block-extension' ),
					value: 'blink',
					image: 'editor-options/cursor-blinking_1.gif',
				},
				{
					label: _x( 'Smooth', 'setting option label', 'custom-html-block-extension' ),
					value: 'smooth',
					image: 'editor-options/cursor-blinking_2.gif',
				},
				{
					label: _x( 'Phase', 'setting option label', 'custom-html-block-extension' ),
					value: 'phase',
					image: 'editor-options/cursor-blinking_3.gif',
				},
				{
					label: _x( 'Expand', 'setting option label', 'custom-html-block-extension' ),
					value: 'expand',
					image: 'editor-options/cursor-blinking_4.gif',
				},
				{
					label: _x( 'Solid', 'setting option label', 'custom-html-block-extension' ),
					value: 'solid',
					image: 'editor-options/cursor-blinking_5.jpg',
				},
			] }
			help={ {
				description: __( 'Controls the cursor animation style.', 'custom-html-block-extension' ),
				colCount: 5,
			} }
		/>
	);
}
