/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';

export default function CursorSurroundingLinesStyle() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Cursor Surrounding Lines Style', 'custom-html-block-extension' ),
				getValue: ( { editorOptions } ) => 'all' === editorOptions.cursorSurroundingLinesStyle,
				setValue: ( value ) => ( {
					editorOptions: { cursorSurroundingLinesStyle: !! value ? 'all' : 'default' },
				} ),
				defaultValue: false,
				help: {
					description: __(
						'Controls when "Cursor Surrounding Lines" should be enforced.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/cursor-surrounding-lines-style_1.gif',
							description: __(
								'"Cursor Surrounding Lines" is always enforced, including when the cursor is moved by a mouse click.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/cursor-surrounding-lines-style_2.gif',
							description: __(
								'"Cursor Surrounding Lines" is enforced only when the cursor is moved with the keyboard.',
								'custom-html-block-extension'
							),
						},
					],
				},
			} }
		/>
	);
}
