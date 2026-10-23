/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function FontLigatures() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Font Ligatures', 'custom-html-block-extension' ),
				...editorOption( 'fontLigatures' ),
				// monaco also accepts a string, used as the CSS `font-feature-settings`
				// value (e.g. '"ss01", "ss02"' for stylistic sets). Only Fira Code supports
				// ligatures among the fonts here, so a free-form field is of little use and
				// the toggle only maps between `true` and `false`.
				defaultValue: false,
				help: {
					description: __(
						"Enables/Disables font ligatures ('calt' and 'liga' font features). Only Fira Code font supports ligatures.",
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/font-ligatures_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/font-ligatures_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
