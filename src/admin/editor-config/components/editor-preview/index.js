/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { addNotification } from 'lib/helper';
import MonacoEditor from 'components/monaco-editor';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';
import { useContext } from '@wordpress/element';

export default function EditorPreview( { isEditorDisabled, setFontWeights } ) {
	const { code, setCode, editorSettings, editorOptions, setEditorOptions } =
		useContext( AdminContext );

	const onFontLoad = ( { isSuccess, font } ) => {
		if ( ! isSuccess ) {
			addNotification(
				sprintf(
					/* translators: %s is replaced with the number. */
					__( 'Failed to load the font. (%s)', 'custom-html-block-extension' ),
					font.label
				),
				'danger',
				5000
			);
			setFontWeights( [ 300, 400, 500, 600, 700 ] );
			setEditorOptions( {
				...editorOptions,
				fontFamily: 'Fira Code',
				fontWeight: 300,
			} );
		} else {
			setFontWeights( font.weight );
			setEditorOptions( {
				...editorOptions,
			} );
		}
	};

	return (
		<Disabled isDisabled={ isEditorDisabled }>
			<MonacoEditor
				className="chbe-admin-editor-config-editor-preview"
				language={ 'html' }
				loading={ __( 'Loading…', 'custom-html-block-extension' ) }
				theme={ editorSettings.theme }
				options={ editorOptions }
				value={ code }
				useEmmet={ editorSettings.emmet }
				tabSize={ editorSettings.tabSize }
				insertSpaces={ editorSettings.insertSpaces }
				onChange={ setCode }
				onFontLoad={ onFontLoad }
			/>
		</Disabled>
	);
}
