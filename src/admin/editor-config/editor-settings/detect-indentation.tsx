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

export default function DetectIndentation() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const title = __( 'Detect Indentation', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorSettings( {
			...editorSettings,
			detectIndentation: value,
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
			<SwitchControl
				label={ title }
				checked={ editorSettings.detectIndentation }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether "Tab Size" and "Insert Spaces" will be automatically detected when a file is opened based on the file contents.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle={ false }
				value={ editorSettings.detectIndentation }
			/>
		</Stack>
	);
}
