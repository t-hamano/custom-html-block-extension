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

	const title = __( 'Detect indentation from content', 'custom-html-block-extension' );
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
					'Detect the indent width and indent type from the content when the editor is opened. If the indentation cannot be detected, the "Indent width" and "Indent type" settings are used.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle={ false }
				value={ editorSettings.detectIndentation }
			/>
		</Stack>
	);
}
