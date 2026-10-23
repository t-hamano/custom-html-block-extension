/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function ScrollBeyondLastLine() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Scroll Beyond Last Line', 'custom-html-block-extension' ),
				...editorOption( 'scrollBeyondLastLine' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor will scroll beyond the last line.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/scroll-beyond-last-line_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/scroll-beyond-last-line_2.gif',
						},
					],
				},
			} }
		/>
	);
}
