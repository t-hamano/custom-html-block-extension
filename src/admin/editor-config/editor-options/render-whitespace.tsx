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

export default function RenderWhitespace() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'renderWhitespace' ] ) => {
		setEditorOptions( {
			...editorOptions,
			renderWhitespace: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Render Whitespace', 'custom-html-block-extension' ) }
			value={ editorOptions.renderWhitespace }
			onChange={ onChange }
			defaultValue="selection"
			options={ [
				{
					label: __( 'All', 'custom-html-block-extension' ),
					value: 'all',
					image: 'editor-options/render-whitespace_1.jpg',
				},
				{
					label: __(
						'Render whitespace other than single spaces between words',
						'custom-html-block-extension'
					),
					value: 'boundary',
					image: 'editor-options/render-whitespace_2.jpg',
				},
				{
					label: __( 'Render only whitespace in the selected text', 'custom-html-block-extension' ),
					value: 'selection',
					image: 'editor-options/render-whitespace_3.jpg',
				},
				{
					label: __( 'Render only trailing whitespace', 'custom-html-block-extension' ),
					value: 'trailing',
					image: 'editor-options/render-whitespace_4.jpg',
				},
				{
					label: __( 'None', 'custom-html-block-extension' ),
					value: 'none',
					image: 'editor-options/render-whitespace_5.jpg',
				},
			] }
			help={ {
				description: __(
					'Controls how the editor should render whitespace characters.',
					'custom-html-block-extension'
				),
				showOptions: true,
			} }
		/>
	);
}
