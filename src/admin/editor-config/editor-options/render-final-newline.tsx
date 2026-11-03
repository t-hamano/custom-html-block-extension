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

export default function RenderFinalNewline() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'renderFinalNewline' ] ) => {
		setEditorOptions( {
			...editorOptions,
			renderFinalNewline: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			name="renderFinalNewline"
			label={ __( 'Render Final Newline', 'custom-html-block-extension' ) }
			value={ editorOptions.renderFinalNewline }
			onChange={ onChange }
			defaultValue="on"
			options={ [
				{
					label: _x( 'Enable', 'setting option label', 'custom-html-block-extension' ),
					value: 'on',
					image: 'editor-options/render-final-newline_1.jpg',
					description: __(
						'The last line number is shown when the file ends with a newline.',
						'custom-html-block-extension'
					),
				},
				{
					label: _x( 'Dimmed', 'setting option label', 'custom-html-block-extension' ),
					value: 'dimmed',
					image: 'editor-options/render-final-newline_2.jpg',
					description: __(
						'The last line number is shown dimmed when the file ends with a newline.',
						'custom-html-block-extension'
					),
				},
				{
					label: _x( 'Disable', 'setting option label', 'custom-html-block-extension' ),
					value: 'off',
					image: 'editor-options/render-final-newline_3.jpg',
					description: __(
						'The last line number is not shown when the file ends with a newline.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Render last line number when the file ends with a newline.',
					'custom-html-block-extension'
				),
				colCount: 3,
			} }
		/>
	);
}
