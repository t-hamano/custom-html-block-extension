/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function StickyTabStops() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Sticky Tab Stops', 'custom-html-block-extension' ),
				...editorOption( 'stickyTabStops' ),
				defaultValue: false,
				help: {
					description: __(
						'Emulate selection behavior of tab characters when using spaces for indentation. Selection will stick to tab stops.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/sticky-tab-stops_1.gif',
							description: __(
								'Within indentation made of spaces, the Left and Right arrow keys move the cursor by a full tab stop, as if the indentation were tab characters.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/sticky-tab-stops_2.gif',
							description: __(
								'Within indentation made of spaces, the Left and Right arrow keys move the cursor one space at a time.',
								'custom-html-block-extension'
							),
						},
					],
				},
			} }
		/>
	);
}
