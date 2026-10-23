/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function RenderLineHighlightOnlyWhenFocus() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			renderLineHighlightOnlyWhenFocus: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Render Line Highlight Only When Focus', 'custom-html-block-extension' ) }
			value={ editorOptions.renderLineHighlightOnlyWhenFocus }
			onChange={ onChange }
			defaultValue={ false }
			options={ [
				{
					value: true,
					image: 'editor-options/render-line-highlight-only-when-focus_1.gif',
				},
				{
					value: false,
					image: 'editor-options/render-line-highlight-only-when-focus_2.gif',
				},
			] }
			help={ {
				description: __(
					'Controls if the editor should render the current line highlight only when the editor is focused.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
