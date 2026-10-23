/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function QuickSuggestions() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const isEnabled = editorOptions.suggestOnTriggerCharacters;

	const onChange = ( value: boolean ) => {
		const quickSuggestionsValue = value ? 'on' : 'off';
		setEditorOptions( {
			...editorOptions,
			quickSuggestions: {
				other: quickSuggestionsValue,
				comments: quickSuggestionsValue,
				strings: quickSuggestionsValue,
			},
			suggestOnTriggerCharacters: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Enable Suggestions', 'custom-html-block-extension' ) }
			value={ isEnabled }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __(
					'Get suggestions as you type codes. Accepting suggestions will autocomplete code and help faster coding.',
					'custom-html-block-extension'
				),
				image: 'editor-options/quick-suggestions.gif',
			} }
		/>
	);
}
