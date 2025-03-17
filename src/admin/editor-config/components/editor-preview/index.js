/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import MonacoEditor from '../../../../components/monaco-editor';

export default function EditorPreview( { isEditorDisabled, setFontWeights } ) {
	const { code, setCode, editorSettings, editorOptions, setEditorOptions } =
		useContext( AdminContext );
	const { createErrorNotice } = useDispatch( noticesStore );

	const onFontLoad = ( { isSuccess, font } ) => {
		if ( ! isSuccess ) {
			createErrorNotice(
				sprintf(
					/* translators: %s is replaced with the font family name. */
					__( 'Failed to load the font. (%s)', 'custom-html-block-extension' ),
					font.label
				)
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
		<div className="chbe-admin-editor-config-editor-preview">
			{ ! isEditorDisabled && (
				<MonacoEditor
					language="html"
					theme={ editorSettings.theme }
					options={ editorOptions }
					value={ code }
					useEmmet={ editorSettings.emmet }
					tabSize={ editorSettings.tabSize }
					insertSpaces={ editorSettings.insertSpaces }
					onChange={ setCode }
					onFontLoad={ onFontLoad }
				/>
			) }
		</div>
	);
}
