/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import ItemHelp from '../../components/item-help';

export default function FindSeedSearchStringFromSelection() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				seedSearchStringFromSelection: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Seed search string from selection', 'custom-html-block-extension' ) }
				checked={ editorOptions.find.seedSearchStringFromSelection }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Search string from selection', 'custom-html-block-extension' ) }
				isToggle
				defaultToggle={ true }
				image={ 'editor-options/find/seed-search-string-from-selection.gif' }
				value={ editorOptions.find.seedSearchStringFromSelection }
			/>
		</div>
	);
}
