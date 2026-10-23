/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function GlyphMargin() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Glyph Margin', 'custom-html-block-extension' ),
				...editorOption( 'glyphMargin' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should render the vertical glyph margin.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/glyph-margin_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/glyph-margin_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
