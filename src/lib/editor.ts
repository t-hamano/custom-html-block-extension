/**
 * Monaco editor setup shared by the block, classic, and theme/plugin editors.
 */

/**
 * External dependencies
 */
import webfontloader from 'webfontloader';
import type * as Monaco from 'monaco-editor';

/**
 * Internal dependencies
 */
import themes from './themes';
import type { EditorOptions, FontLoadResult } from '../types';

/**
 * Build the options passed to `monaco.editor.create`.
 *
 * @param args           Arguments.
 * @param args.defaults  Options that the editor options can override.
 * @param args.options   Editor options saved in the settings.
 * @param args.overrides Options that override the editor options.
 * @return Construction options.
 */
export function getConstructionOptions( {
	defaults = {},
	options,
	overrides = {},
}: {
	defaults?: Record< string, unknown >;
	options: Partial< EditorOptions >;
	overrides?: Record< string, unknown >;
} ): Monaco.editor.IStandaloneEditorConstructionOptions {
	return {
		...defaults,
		...options,
		...overrides,
		// Monaco's HTML outline is flat, so the default `outlineModel` pins no lines in sticky scroll.
		stickyScroll: {
			...options.stickyScroll,
			defaultModel: 'foldingProviderModel',
		},
	} as Monaco.editor.IStandaloneEditorConstructionOptions;
}

/**
 * Apply a built-in theme or one of the bundled custom themes.
 *
 * @param monaco The monaco instance.
 * @param theme  Theme name.
 */
export function applyTheme( monaco: typeof Monaco, theme: string ) {
	if ( 'vs-dark' === theme || 'light' === theme ) {
		monaco.editor.setTheme( theme );
		return;
	}
	const targetTheme = themes.find( ( data ) => theme === data.value );
	if ( targetTheme ) {
		monaco.editor.defineTheme( targetTheme.value, targetTheme.data );
		monaco.editor.setTheme( targetTheme.value );
	}
}

/**
 * Load the web font of the font family and remeasure the fonts once it is loaded.
 *
 * @param monaco          The monaco instance.
 * @param fontFamily      Font family name.
 * @param args            Arguments.
 * @param args.document   Document the editor is rendered in.
 * @param args.onFontLoad Called when the font is loaded or fails to load.
 */
export function loadFont(
	monaco: typeof Monaco,
	fontFamily: string | undefined,
	{
		document: ownerDocument = document,
		onFontLoad,
	}: {
		document?: Document;
		onFontLoad?: ( result: FontLoadResult ) => void;
	} = {}
) {
	const font = window.chbeObj.fontFamily.find( ( data ) => fontFamily === data.name );
	if ( undefined === font || ! ( 'label' in font ) ) {
		return;
	}

	const webfontConfig: WebFont.Config = {
		timeout: 5000,
		custom: {
			families: [ font.name ],
		},
		active: () => {
			monaco.editor.remeasureFonts();
			onFontLoad?.( { isSuccess: true, font } );
		},
		inactive: () => {
			monaco.editor.remeasureFonts();
			onFontLoad?.( { isSuccess: false, font } );
		},
		context: ownerDocument.defaultView ?? undefined,
	};

	// Add stylesheet if it is not in current document.
	if ( 'stylesheet' in font && font.stylesheet ) {
		const link = ownerDocument.querySelector( `link[href="${ font.stylesheet }"]` );
		if ( ! link ) {
			webfontConfig.custom!.urls = [ font.stylesheet ];
		}
	}

	webfontloader.load( webfontConfig );
}

/**
 * Apply the bracket pair colorization option to the model. The standalone editor
 * doesn't pass the `bracketPairColorization` editor option on to the model, so set
 * it on the model directly.
 *
 * @see https://github.com/microsoft/monaco-editor/issues/3829
 *
 * @param model                   The editor model.
 * @param bracketPairColorization Bracket pair colorization option.
 */
export function applyBracketPairColorization(
	model: Monaco.editor.ITextModel | null | undefined,
	bracketPairColorization: EditorOptions[ 'bracketPairColorization' ] | undefined
) {
	if ( model && bracketPairColorization ) {
		model.updateOptions( {
			bracketColorizationOptions: bracketPairColorization,
		} );
	}
}

/**
 * Catch the Ctrl+X or Ctrl+C shortcut and execute the clipboard action. Without
 * a range selection, these shortcuts cut or copy the block, so execute the custom
 * action instead.
 *
 * @param editor The editor instance.
 * @param monaco The monaco instance.
 * @param action Clipboard action.
 */
export function addClipboardCommand(
	editor: Monaco.editor.IStandaloneCodeEditor,
	monaco: typeof Monaco,
	action: 'cut' | 'copy'
) {
	const keyCode = 'cut' === action ? monaco.KeyCode.KeyX : monaco.KeyCode.KeyC;
	const actionId =
		'cut' === action ? 'editor.action.clipboardCutAction' : 'editor.action.clipboardCopyAction';

	editor.addCommand(
		// eslint-disable-next-line no-bitwise
		monaco.KeyMod.CtrlCmd | keyCode,
		() => {
			const selection = editor.getSelection();
			const position = editor.getPosition();
			if ( ! selection || ! position ) {
				return;
			}
			const lineNumber = position.lineNumber;
			const isEmptySelection =
				selection.startLineNumber === selection.endLineNumber &&
				selection.startColumn === selection.endColumn;

			if ( window.chbeObj.editorOptions.emptySelectionClipboard ) {
				if ( isEmptySelection ) {
					// Select the current line if there is no range selection and "Copy the current line without selection" is enabled.
					editor.setSelection( new monaco.Selection( lineNumber, 1, lineNumber + 1, 1 ) );
				}
				editor.trigger( 'keyboard', actionId, null );
			} else if ( ! isEmptySelection ) {
				editor.trigger( 'keyboard', actionId, null );
			}
		}
	);
}

/**
 * Catch the Ctrl+S shortcut to save the content.
 *
 * @param editor The editor instance.
 * @param monaco The monaco instance.
 * @param onSave Called when the shortcut is pressed.
 */
export function addSaveCommand(
	editor: Monaco.editor.IStandaloneCodeEditor,
	monaco: typeof Monaco,
	onSave: () => void
) {
	editor.addCommand(
		// eslint-disable-next-line no-bitwise
		monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
		onSave
	);
}
