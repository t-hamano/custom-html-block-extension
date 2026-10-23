/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function FormatOnPaste() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Format On Paste', 'custom-html-block-extension' ),
				...editorOption( 'formatOnPaste' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether the editor should automatically format the pasted content.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/format-on-paste_1.gif',
							description: __(
								'Pasted content is automatically formatted to match the surrounding code.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/format-on-paste_2.gif',
							description: __(
								'Pasted content is inserted as is, without formatting.',
								'custom-html-block-extension'
							),
						},
					],
				},
			} }
		/>
	);
}
