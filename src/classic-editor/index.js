/**
 * External dependencies
 */
import loader from '@monaco-editor/loader';
import webfontloader from 'webfontloader';
import { emmetHTML } from 'emmet-monaco-es';

/**
 * Internal dependencies
 */
import themes from 'themes';

loader.init().then( monaco => {

	let isMonacEditorEnabled = false;

	const isEditorEnabled = null !== document.getElementById( 'content' );
	const isVisualEditorEnabled = null !== document.getElementById( 'content-tmce' ) && null !== document.getElementById( 'content-html' );
	const isVisualEditMode = -1 === document.cookie.indexOf( 'editor%3Dhtml' );

	const tabTmce = document.getElementById( 'content-tmce' );
	const tabHtml = document.getElementById( 'content-html' );
	const toolbar = document.getElementById( 'ed_toolbar' );
	const textarea = document.getElementById( 'content' );
	const editorContainer = document.getElementById( 'wp-content-editor-container' );
	const draftButton = document.getElementById( 'save-post' );
	const publishButton = document.getElementById( 'publish' );
	const replaceIndentButton = document.getElementById( 'chbe-replace-indent-button' );

	// Setting up the monaco editor.
	const runEditor = ( target ) => {

		// Generate an element to apply the monaco editor.
		const monacoEditorContainer = document.createElement( 'div' );
		monacoEditorContainer.setAttribute( 'id', 'monaco-editor-container' );

		target.appendChild( monacoEditorContainer );

		// Monaco editor properties.
		const properties = {
			theme: chbeObj.editorSettings.theme,
			value: textarea.value,
			language: 'php',
			automaticLayout: true,
			...chbeObj.editorOptions
		};

		// Override properties to match the classic editor.
		properties.scrollBeyondLastLine = false;
		properties.scrollbar.vertical = 'hidden';
		properties.scrollbar.alwaysConsumeMouseWheel = false;

		// Create monaco editor.
		window.editor = monaco.editor.create(
			monacoEditorContainer,
			properties,
		);

		// Change editor area height.
		const contentHeight = Math.max( 300, window.editor.getContentHeight() );
		monacoEditorContainer.style.height = `${contentHeight}px`;

		window.editor.getModel().onDidChangeContent( ( event ) => {

			// Apply changes in the editor to the original textarea.
			textarea.value = window.editor.getModel().getValue();

			// Change editor area height.
			const contentHeight = Math.max( 300, window.editor.getContentHeight() );
			monacoEditorContainer.style.height = `${contentHeight}px`;
		});

		// Enable Emmet.
		if ( chbeObj.editorSettings.emmet ) {
			emmetHTML( monaco );
		}

		// Update editor settings.
		if ( 'vs-dark' !== chbeObj.editorSettings.theme && 'light' !== chbeObj.editorSettings.theme ) {
			const theme = themes.find( ( data ) => chbeObj.editorSettings.theme === data.value );
			if ( undefined !== theme ) {
				monaco.editor.defineTheme( theme.value, theme.data );
				monaco.editor.setTheme( theme.value );
			}
		}

		window.editor.getModel().updateOptions({
			tabSize: chbeObj.editorSettings.tabSize,
			insertSpaces: chbeObj.editorSettings.insertSpaces
		});

		// Catch the Ctrl+S command to save draft or publish post.
		window.editor.addCommand( monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
			if ( !! draftButton ) {
				draftButton.click();
			} else {
				publishButton.click();
			}
		});

		// Load webfont.
		const font = chbeObj.fontFamily.find( ( data ) => chbeObj.editorOptions.fontFamily === data.name );

		if ( undefined !== font && 'label' in font ) {
			const webfontConfig = {
				custom: {
					families: [ font.name ]
				}
			};

			if ( 'stylesheet' in font ) {
				webfontConfig.custom.urls = [ font.stylesheet ];
			}

			webfontloader.load({
				timeout: 2000,
				...webfontConfig,
				active: () => {

					// Adjust the position of the cursor and space.
					monaco.editor.remeasureFonts();
				}
			});
		}

		updateToolbarMargin();
		window.addEventListener( 'resize', onWindowResize );
		isMonacEditorEnabled = true;
	};

	// Add a margin above the monaco editor that is the same height as the toolbar.
	const updateToolbarMargin = ( ) => {
		document.getElementById( 'monaco-editor-container' ).style.marginTop = toolbar.clientHeight + 'px';
	};

	// Switch to visual editor tab.
	const toVisual = () => {
		if ( isMonacEditorEnabled ) {
			monaco.editor.getModels().forEach( model => model.dispose() );
			document.getElementById( 'monaco-editor-container' ).remove();
			tabHtml.onclick = toHtml;
			isMonacEditorEnabled = false;
			window.removeEventListener( 'resize', onWindowResize );
		}

		replaceIndentButton.style.display = 'none';
	};

	// Switch to html editor tab.
	const toHtml = () => {
		if ( ! isMonacEditorEnabled ) {
			setTimeout( () => {
				runEditor( editorContainer );
			}, 300 );
			tabTmce.onclick = toVisual;
		}

		setTimeout( () => {
			updateToolbarMargin();
		}, 300 );

		replaceIndentButton.style.display = 'inline-block';
	};

	// Window resize event.
	const onWindowResize = () => {
		setTimeout( () => {
			updateToolbarMargin();
		}, 300 );
	};

	// Initialize
	if ( ! isEditorEnabled ) {
		return;
	}

	if ( ! isVisualEditorEnabled ) {
		runEditor( editorContainer );
		replaceIndentButton.style.display = 'inline-block';
	} else if ( isVisualEditMode ) {
		tabHtml.onclick = toHtml;
	} else {
		runEditor( editorContainer );
		replaceIndentButton.style.display = 'inline-block';
		tabTmce.onclick = toVisual;
	}
});
