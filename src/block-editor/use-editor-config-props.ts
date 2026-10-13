/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { MonacoEditorProps } from '../components/monaco-editor';
import type { EditorOptions } from '../types';

type EditorConfigProps = Required<
	Pick<
		MonacoEditorProps,
		'theme' | 'options' | 'useEmmet' | 'tabSize' | 'insertSpaces' | 'detectIndentation'
	>
>;

/**
 * Get the `MonacoEditor` props from the editor settings and options saved in the settings.
 *
 * @param getOptions Function that receives the saved editor options and returns
 *                   the options passed to the editor. Called only once.
 * @return `MonacoEditor` props.
 */
export default function useEditorConfigProps(
	getOptions: ( editorOptions: EditorOptions ) => Partial< EditorOptions > = ( editorOptions ) =>
		editorOptions
): EditorConfigProps {
	return useMemo( () => {
		const { editorSettings, editorOptions } = window.chbeObj;
		return {
			theme: editorSettings.theme,
			options: getOptions( editorOptions ),
			useEmmet: editorSettings.emmet,
			tabSize: editorSettings.tabSize,
			insertSpaces: editorSettings.insertSpaces,
			detectIndentation: editorSettings.detectIndentation,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );
}
