/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function QuickSuggestions() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable suggest', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			quickSuggestions: value,
			suggestOnTriggerCharacters: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<Stack justify="start" align="start" wrap="wrap" gap="sm">
				<ToggleControl
					label={ title }
					checked={ editorOptions.quickSuggestions }
					onChange={ onChange }
				/>
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
					value={ editorOptions.quickSuggestions }
				/>
			</Stack>
		</div>
	);
}
