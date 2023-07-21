/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function QuickSuggestions() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			quickSuggestions: value,
			suggestOnTriggerCharacters: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Enable suggest', 'custom-html-block-extension' ) }
				checked={ editorOptions.quickSuggestions }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Enable suggest', 'custom-html-block-extension' ) }
				description={ __(
					'Get suggestions as you type codes. Accepting suggestions will autocomplete code and help faster coding.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle={ true }
				image={ 'editor-options/quick-suggestions.gif' }
				value={ editorOptions.quickSuggestions }
			/>
		</div>
	);
}
