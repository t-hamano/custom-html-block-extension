/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function WordWrapIndicator() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Word Wrap Indicator', 'custom-html-block-extension' ),
				...editorOption( 'wordWrapIndicator' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether an indicator is rendered at the wrapping column of lines that wrap.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/word-wrap-indicator_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/word-wrap-indicator_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
