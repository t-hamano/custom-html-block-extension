/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

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

	const onChange = ( value: string ) => {
		setEditorSettings( {
			...editorSettings,
			theme: value,
		} );
	};

	return (
		<Stack className="chbe-admin-editor-config__setting-item" gap="sm">
			<SelectControl
				__next40pxDefaultSize
				label={ title }
				value={ editorSettings.theme }
				options={ [
					{ label: __( 'Visual Studio Dark', 'custom-html-block-extension' ), value: 'vs-dark' },
					{ label: __( 'Light', 'custom-html-block-extension' ), value: 'light' },
					...themes,
				] }
				onChange={ onChange }
			/>
		</Stack>
	);
}
