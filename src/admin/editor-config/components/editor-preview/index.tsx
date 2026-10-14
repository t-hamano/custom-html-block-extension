/**
 * External dependencies
 */
import type { Dispatch, SetStateAction } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import MonacoEditor from '../../../../components/monaco-editor';
import type { FontLoadResult, PreviewLanguage } from '../../../../types';

const LANGUAGES: { label: string; value: PreviewLanguage }[] = [
	{ label: __( 'HTML', 'custom-html-block-extension' ), value: 'html' },
	{ label: __( 'PHP', 'custom-html-block-extension' ), value: 'php' },
	{ label: __( 'JavaScript', 'custom-html-block-extension' ), value: 'javascript' },
	{ label: __( 'CSS', 'custom-html-block-extension' ), value: 'css' },
];

type EditorPreviewProps = {
	isEditorDisabled: boolean;
	setFontWeights: Dispatch< SetStateAction< number[] > >;
};

export default function EditorPreview( { isEditorDisabled, setFontWeights }: EditorPreviewProps ) {
	const {
		code,
		setCode,
		previewLanguage,
		setPreviewLanguage,
		editorSettings,
		editorOptions,
		setEditorOptions,
	} = useContext( AdminContext );
	const { createErrorNotice } = useDispatch( noticesStore );

	const onFontLoad = ( { isSuccess, font }: FontLoadResult ) => {
		if ( ! isSuccess ) {
			createErrorNotice(
				sprintf(
					/* translators: %s is replaced with the font family name. */
					__( 'Failed to load the font. (%s)', 'custom-html-block-extension' ),
					font.label ?? font.name
				)
			);
			setFontWeights( [ 300, 400, 500, 600, 700 ] );
			setEditorOptions( {
				...editorOptions,
				fontFamily: 'Fira Code',
				fontWeight: '300',
			} );
		} else {
			setFontWeights( font.weight ?? [] );
			setEditorOptions( {
				...editorOptions,
			} );
		}
	};

	return (
		<Stack direction="column" gap="sm">
			<ToggleGroupControl
				label={ __( 'Language', 'custom-html-block-extension' ) }
				value={ previewLanguage }
				onChange={ ( value ) => setPreviewLanguage( value as PreviewLanguage ) }
				isBlock
				hideLabelFromVision
			>
				{ LANGUAGES.map( ( language ) => (
					<ToggleGroupControlOption
						key={ language.value }
						value={ language.value }
						label={ language.label }
					/>
				) ) }
			</ToggleGroupControl>
			<div className="chbe-admin-editor-config-editor-preview">
				{ ! isEditorDisabled && (
					<MonacoEditor
						// The language is applied only when the editor is created, so remount it on change.
						key={ previewLanguage }
						language={ previewLanguage }
						theme={ editorSettings.theme }
						options={ editorOptions }
						value={ code[ previewLanguage ] }
						useEmmet={ editorSettings.emmet }
						tabSize={ editorSettings.tabSize }
						insertSpaces={ editorSettings.insertSpaces }
						detectIndentation={ editorSettings.detectIndentation }
						onChange={ ( value ) =>
							setCode( ( prevCode ) => ( { ...prevCode, [ previewLanguage ]: value } ) )
						}
						onFontLoad={ onFontLoad }
					/>
				) }
			</div>
		</Stack>
	);
}
