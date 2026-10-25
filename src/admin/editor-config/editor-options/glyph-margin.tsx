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

export default function GlyphMargin() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			glyphMargin: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="glyphMargin"
			label={ __( 'Glyph Margin', 'custom-html-block-extension' ) }
			value={ editorOptions.glyphMargin }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/glyph-margin_1.jpg',
				},
				{
					value: false,
					image: 'editor-options/glyph-margin_2.jpg',
				},
			] }
			help={ {
				description: __(
					'Controls whether the editor should render the vertical glyph margin.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
