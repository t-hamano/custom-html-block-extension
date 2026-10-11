/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import themes from '../../../lib/themes';

export default function Theme() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const title = __( 'Theme', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{ label: __( 'Visual Studio Dark', 'custom-html-block-extension' ), value: 'vs-dark' },
		{ label: __( 'Light', 'custom-html-block-extension' ), value: 'light' },
		...themes,
	];

	const onChange = ( value: string ) => {
		setEditorSettings( {
			...editorSettings,
			theme: value,
		} );
	};

	return (
		<Stack className="chbe-admin-editor-config__setting-item" gap="sm">
			<SelectControl
				label={ title }
				items={ items }
				value={ items.find( ( item ) => item.value === editorSettings.theme ) ?? null }
				onValueChange={ ( item ) => item?.value && onChange( item.value ) }
			/>
		</Stack>
	);
}
