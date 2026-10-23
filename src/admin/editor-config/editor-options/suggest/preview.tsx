/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function SuggestPreview() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Preview', 'custom-html-block-extension' ),
				group: __( 'Suggest', 'custom-html-block-extension' ),
				...editorOption( 'suggest', 'preview' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether to preview the suggestion outcome in the editor.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/suggest/preview_1.gif',
							description: __(
								'The selected suggestion is shown in the editor before it is accepted.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/suggest/preview_2.gif',
							description: __(
								'The selected suggestion is shown only in the suggestion list until it is accepted.',
								'custom-html-block-extension'
							),
						},
					],
				},
			} }
		/>
	);
}
