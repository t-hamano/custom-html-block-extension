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

export default function CursorStyle() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'cursorStyle' ] ) => {
		setEditorOptions( {
			...editorOptions,
			cursorStyle: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Cursor Style', 'custom-html-block-extension' ) }
			value={ editorOptions.cursorStyle }
			onChange={ onChange }
			defaultValue="line"
			options={ [
				{
					label: __( 'Line', 'custom-html-block-extension' ),
					value: 'line',
					image: 'editor-options/cursor-style_1.jpg',
				},
				{
					label: __( 'Thin line', 'custom-html-block-extension' ),
					value: 'line-thin',
					image: 'editor-options/cursor-style_2.jpg',
				},
				{
					label: __( 'Block', 'custom-html-block-extension' ),
					value: 'block',
					image: 'editor-options/cursor-style_3.jpg',
				},
				{
					label: __( 'Outline', 'custom-html-block-extension' ),
					value: 'block-outline',
					image: 'editor-options/cursor-style_4.jpg',
				},
				{
					label: __( 'Underline', 'custom-html-block-extension' ),
					value: 'underline',
					image: 'editor-options/cursor-style_5.jpg',
				},
				{
					label: __( 'Thin underline', 'custom-html-block-extension' ),
					value: 'underline-thin',
					image: 'editor-options/cursor-style_6.jpg',
				},
			] }
			help={ {
				description: __( 'Controls the cursor style.', 'custom-html-block-extension' ),
				showOptions: true,
				colCount: 3,
			} }
		/>
	);
}
