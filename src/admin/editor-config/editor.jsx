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

const Editor = ( { isEditorDisabled, setFontWeights } ) => {
	const { code, setCode, editorSettings, editorOptions, setEditorOptions } = useContext(
		AdminContext
	);

	const handleChange = ( value ) => {
		setCode( value );
	};

	const handleOnFontLoaded = ( { isSuccess, font } ) => {
		if ( isSuccess && font ) {
			setFontWeights( font.weight );
			setEditorOptions( {
				...editorOptions,
				fontFamily: font.name,
				fontWeight: 300,
			} );
		} else {
			// Font loading failed.
			addNotification(
				sprintf(
					/* translators: %d is replaced with the number of font name. */
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
		}
	};

	const monacoEditor = (
		<MonacoEditor
			className="chbe-monaco"
			language={ 'html' }
			loading={ __( 'Loading…', 'custom-html-block-extension' ) }
			theme={ editorSettings.theme }
			options={ editorOptions }
			value={ code }
			useEmmet={ editorSettings.emmet }
			onChange={ handleChange }
			onFontLoaded={ handleOnFontLoaded }
		/>
	);

	return <>{ isEditorDisabled ? <Disabled>{ monacoEditor }</Disabled> : <>{ monacoEditor }</> }</>;
};

export default Editor;
