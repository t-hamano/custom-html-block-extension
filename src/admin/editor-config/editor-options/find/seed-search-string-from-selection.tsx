/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function FindSeedSearchStringFromSelection() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Seed search string from selection', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const isEnabled = 'always' === editorOptions.find.seedSearchStringFromSelection;

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				seedSearchStringFromSelection: value ? 'always' : 'never',
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl label={ title } checked={ isEnabled } onChange={ onChange } />
				<ItemHelp
					onChange={ onChange }
					title={ title }
					isToggle
					defaultToggle
					image="editor-options/find/seed-search-string-from-selection.gif"
					value={ isEnabled }
				/>
			</HStack>
		</div>
	);
}
