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
import { selectSetting } from '../components/setting-item/helpers';

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
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Render Final Newline', 'custom-html-block-extension' ),
				value: editorOptions.renderFinalNewline,
				onChange,
				defaultValue: 'on',
				options: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: 'on',
						image: 'editor-options/render-final-newline_1.jpg',
						description: __(
							'The last line number is shown when the file ends with a newline.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Dimmed', 'custom-html-block-extension' ),
						value: 'dimmed',
						image: 'editor-options/render-final-newline_2.jpg',
						description: __(
							'The last line number is shown dimmed when the file ends with a newline.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: 'off',
						image: 'editor-options/render-final-newline_3.jpg',
						description: __(
							'The last line number is not shown when the file ends with a newline.',
							'custom-html-block-extension'
						),
					},
				],
				help: {
					description: __(
						'Render last line number when the file ends with a newline.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
