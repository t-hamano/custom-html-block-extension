/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function FontLigatures() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	// monaco also accepts a string, used as the CSS `font-feature-settings`
	// value (e.g. '"ss01", "ss02"' for stylistic sets). Only Fira Code supports
	// ligatures among the fonts here, so a free-form field is of little use and
	// the toggle only maps between `true` and `false`.

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			fontLigatures: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="fontLigatures"
			label={ __( 'Font Ligatures', 'custom-html-block-extension' ) }
			value={ editorOptions.fontLigatures }
			onChange={ onChange }
			// monaco also accepts a string, used as the CSS `font-feature-settings`
			// value (e.g. '"ss01", "ss02"' for stylistic sets). Only Fira Code supports
			// ligatures among the fonts here, so a free-form field is of little use and
			// the toggle only maps between `true` and `false`.
			defaultValue={ false }
			options={ [
				{
					value: true,
					image: 'editor-options/font-ligatures_1.jpg',
				},
				{
					value: false,
					image: 'editor-options/font-ligatures_2.jpg',
				},
			] }
			help={ {
				description: createInterpolateElement(
					__(
						'Enables/Disables font ligatures (<code>calt</code> and <code>liga</code> font features). Only Fira Code font supports ligatures.',
						'custom-html-block-extension'
					),
					{
						code: <code />,
					}
				),
			} }
		/>
	);
}
