/**
 * External dependencies
 */
import Editor, { useMonaco } from '@monaco-editor/react';
import { emmetHTML } from 'emmet-monaco-es';
import webfontloader from 'webfontloader';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { addNotification } from 'lib/helper';
import themes from 'lib/themes';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';

import { useEffect, useContext, useRef } from '@wordpress/element';

const MonacoEditor = ( { isEditorDisabled, setFontWeights } ) => {
	const monaco = useMonaco();
	const editorRef = useRef( null );

	const {
		code,
		setCode,
		editorSettings,
		editorOptions,
		setEditorOptions,
		setIsWaiting,
	} = useContext( AdminContext );

	useEffect( () => {
		if ( monaco ) {
			// Change theme.
			if ( 'vs-dark' !== editorSettings.theme && 'light' !== editorSettings.theme ) {
				const theme = themes.find( ( data ) => editorSettings.theme === data.value );
				monaco.editor.defineTheme( theme.value, theme.data );
				monaco.editor.setTheme( theme.value );
			}
		}
	}, [ editorSettings.theme ] );

	useEffect( () => {
		if ( monaco && editorRef.current ) {
			// Update editor settings.
			editorRef.current.getModel().updateOptions( {
				tabSize: editorSettings.tabSize,
				insertSpaces: editorSettings.insertSpaces,
			} );
		}
	}, [ editorSettings.tabSize, editorSettings.insertSpaces ] );

	useEffect( () => {
		if ( monaco && editorRef.current ) {
			// Load webfont.
			const font = chbeObj.fontFamily.find( ( data ) => editorOptions.fontFamily === data.name );

			if ( undefined !== font && 'label' in font ) {
				setIsWaiting( true );

				const webfontConfig = {
					custom: {
						families: [ font.name ],
					},
				};

				if ( 'stylesheet' in font ) {
					webfontConfig.custom.urls = [ font.stylesheet ];
				}

				webfontloader.load( {
					timeout: 2000,
					...webfontConfig,
					active: () => {
						// Update editor font family and font weight variations.
						setFontWeights( font.weight );
						setEditorOptions( {
							...editorOptions,
							fontFamily: font.name,
							fontWeight: 300,
						} );

						setIsWaiting( false );

						// Adjust the position of the cursor and space.
						monaco.editor.remeasureFonts();
					},
					inactive: () => {
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
						setIsWaiting( false );
					},
				} );
			}
		}
	}, [ editorOptions.fontFamily ] );

	useEffect( () => {
		if ( monaco && editorRef.current ) {
			// Adjust the position of the cursor and space.
			monaco.editor.remeasureFonts();
		}
	}, [ editorOptions.fontWeight ] );

	const handleChange = ( value ) => {
		setCode( value );
	};

	// eslint-disable-next-line no-shadow
	const handleEditorDidMount = ( editor, monaco ) => {
		editorRef.current = editor;

		// Apply Emmet.
		if ( editorSettings.emmet && ! monaco.enabledEmmet ) {
			monaco.enabledEmmet = true;
			emmetHTML( monaco );
		}

		// Update editor settings.
		if ( 'vs-dark' !== editorSettings.theme && 'light' !== editorSettings.theme ) {
			const theme = themes.find( ( data ) => editorSettings.theme === data.value );
			if ( undefined !== theme ) {
				monaco.editor.defineTheme( theme.value, theme.data );
				monaco.editor.setTheme( theme.value );
			}
		}

		editor.getModel().updateOptions( {
			tabSize: editorSettings.tabSize,
			insertSpaces: editorSettings.insertSpaces,
		} );

		// Load webfont.
		const font = chbeObj.fontFamily.find( ( data ) => editorOptions.fontFamily === data.name );
		if ( undefined !== font && 'label' in font ) {
			const webfontConfig = {
				custom: {
					families: [ font.name ],
				},
			};

			if ( 'stylesheet' in font ) {
				webfontConfig.custom.urls = [ font.stylesheet ];
			}

			webfontloader.load( {
				timeout: 2000,
				...webfontConfig,
				active: () => {
					// Update editor font weight variations.
					setFontWeights( font.weight );

					// Adjust the position of the cursor and space.
					monaco.editor.remeasureFonts();
				},
				inactive: () => {
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
				},
			} );
		}
	};

	return (
		<div className="chbe-monaco">
			{ isEditorDisabled ? (
				<Disabled>
					<Editor
						theme={ editorSettings.theme }
						language={ 'html' }
						loading={ __( 'Loading…', 'custom-html-block-extension' ) }
						value={ code }
						options={ editorOptions }
						onChange={ handleChange }
						onMount={ handleEditorDidMount }
					/>
				</Disabled>
			) : (
				<Editor
					theme={ editorSettings.theme }
					language={ 'html' }
					loading={ __( 'Loading…', 'custom-html-block-extension' ) }
					value={ code }
					options={ editorOptions }
					onChange={ handleChange }
					onMount={ handleEditorDidMount }
				/>
			) }
		</div>
	);
};

export default MonacoEditor;
