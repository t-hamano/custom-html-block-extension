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

	// monaco types this option as 'never' | 'always' | 'selection'. The 'selection'
	// mode is not exposed in the UI yet, so the toggle only maps between 'always'
	// and 'never'.
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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<ToggleControl label={ title } checked={ isEnabled } onChange={ onChange } />
			<ItemHelp
				onChange={ onChange }
				title={ title }
				isToggle
				defaultToggle
				image="editor-options/find/seed-search-string-from-selection.gif"
				value={ isEnabled }
			/>
		</Stack>
	);
}
