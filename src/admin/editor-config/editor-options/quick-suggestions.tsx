/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';

export default function QuickSuggestions() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Enable Suggestions', 'custom-html-block-extension' ),
				getValue: ( { editorOptions } ) => editorOptions.suggestOnTriggerCharacters,
				setValue: ( value ) => {
					const quickSuggestionsValue = value ? 'on' : 'off';
					return {
						editorOptions: {
							quickSuggestions: {
								other: quickSuggestionsValue,
								comments: quickSuggestionsValue,
								strings: quickSuggestionsValue,
							},
							suggestOnTriggerCharacters: value,
						},
					};
				},
				defaultValue: true,
				help: {
					description: __(
						'Get suggestions as you type codes. Accepting suggestions will autocomplete code and help faster coding.',
						'custom-html-block-extension'
					),
					image: 'editor-options/quick-suggestions.gif',
				},
			} }
		/>
	);
}
