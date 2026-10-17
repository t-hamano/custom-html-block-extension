/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function QuickSuggestions() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable Suggestions', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SwitchControl label={ title } checked={ isEnabled } onCheckedChange={ onChange } />
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Get suggestions as you type codes. Accepting suggestions will autocomplete code and help faster coding.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image="editor-options/quick-suggestions.gif"
				value={ isEnabled }
			/>
		</Stack>
	);
}
