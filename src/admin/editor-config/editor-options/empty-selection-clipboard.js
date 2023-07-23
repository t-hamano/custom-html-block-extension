/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import ItemHelp from '../components/item-help';

export default function EmptySelectionClipboard() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			emptySelectionClipboard: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Copy the current line without selection', 'custom-html-block-extension' ) }
				checked={ editorOptions.emptySelectionClipboard }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Copy the current line without selection', 'custom-html-block-extension' ) }
				isToggle
				defaultToggle={ true }
				image={ 'editor-options/empty-selection-clipboard.gif' }
				value={ editorOptions.emptySelectionClipboard }
			/>
		</div>
	);
}
