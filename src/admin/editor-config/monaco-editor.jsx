/**
 * External dependencies
 */
import Editor, { useMonaco } from '@monaco-editor/react';
import { emmetHTML } from 'emmet-monaco-es';
import webfontloader from 'webfontloader';
import { store } from 'react-notifications-component';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import themes from 'themes';
import { htmlCode } from 'admin/common/example-code';

/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';

import {
	useEffect,
	useContext,
	useRef
} from '@wordpress/element';

const MonacoEditor = ({
	isEditorDisabled,
	setFontWeights
}) => {

	const monaco = useMonaco();
	const editorRef = useRef( null );

	const {
		code,
		setCode,
		editorSettings,
		editorOptions,
		setEditorOptions,
		setIsWaiting
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
	}, [ editorSettings.theme ]);

	useEffect( () => {
		if ( monaco && editorRef.current ) {

				// Update editor settings.
				editorRef.current.getModel().updateOptions({
				tabSize: editorSettings.tabSize,
				insertSpaces: editorSettings.insertSpaces
			});
		}
	}, [ editorSettings.tabSize, editorSettings.insertSpaces ]);

	useEffect( () => {
		if ( monaco && editorRef.current ) {

			// Load webfont.
			const font = chbeObj.fontFamily.find( ( data ) => editorOptions.fontFamily === data.fontFamily );

			if ( undefined !== font && 'label' in font && 'fontFamily' in font ) {
				setIsWaiting( true );

				const webfontConfig = {
					custom: {
						families: [ font.fontFamily ]
					}
				};

				if ( 'styleSheet' in font ) {
					webfontConfig.custom.urls = [ font.styleSheet ];
				}

				webfontloader.load({
					timeout: 2000,
					...webfontConfig,
					active: () => {

						// Update editor font family and font weight variations.
						setFontWeights( font.weight );
						setEditorOptions({
							...editorOptions,
							fontFamily: font.fontFamily,
							fontWeight: 300
						});

						setIsWaiting( false );

						// Adjust the position of the cursor and space.
						monaco.editor.remeasureFonts();
					},
					inactive: () => {

						// Font loading failed.
						addNotification(
							sprintf(
								__(
									'Failed to load the font. (%s)',
									'custom-html-block-extension'
								),
								font.label
							),
							'danger'
						);

						setFontWeights([ 300, 400, 500, 600, 700 ]);
						setEditorOptions({
							...editorOptions,
							fontFamily: 'Fira Code',
							fontWeight: 300
						});
						setIsWaiting( false );
					}
				});
			}
		}
	}, [ editorOptions.fontFamily ]);

	useEffect( () => {
		if ( monaco && editorRef.current ) {

			// Adjust the position of the cursor and space.
			monaco.editor.remeasureFonts();
		}
	}, [ editorOptions.fontWeight ]);

	const handleOnChange = ( value ) => {
		setCode( value );
	};

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
			monaco.editor.defineTheme( theme.value, theme.data );
			monaco.editor.setTheme( theme.value );
		}

		editor.getModel().updateOptions({
			tabSize: editorSettings.tabSize,
			insertSpaces: editorSettings.insertSpaces
		});

		// Load webfont.
		const font = chbeObj.fontFamily.find( ( data ) => editorOptions.fontFamily === data.fontFamily );
		if ( undefined !== font && 'label' in font && 'fontFamily' in font ) {
			const webfontConfig = {
				custom: {
					families: [ font.fontFamily ]
				}
			};

			if ( 'styleSheet' in font ) {
				webfontConfig.custom.urls = [ font.styleSheet ];
			}

			webfontloader.load({
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
							__(
								'Failed to load the font. (%s)',
								'custom-html-block-extension'
							),
							font.label
						),
						'danger'
					);
				}
			});
		}
	};

	// Show notification.
	const addNotification = ( message, type ) => {
		store.addNotification({
			message,
			type,
			animation: 'bounce-in',
			insert: 'bottom',
			container: 'top-center',
			isMobile: true,
			dismiss: {
				duration: 5000,
				showIcon: true
			},
			dismissable: {
				click: true,
				touch: true
			}
		});
	};

	return (
		<div className="chbe-monaco">
			{ isEditorDisabled ? (
				<Disabled>
					<Editor
						theme={ editorSettings.theme }
						language={ 'html' }
						loading={ __( 'Loading...', 'custom-html-block-extension' ) }
						value={ code }
						options={ editorOptions }
						onChange={ handleOnChange }
						onMount={ handleEditorDidMount }
					/>
				</Disabled>
			) : (
				<Editor
					theme={ editorSettings.theme }
					language={ 'html' }
					loading={ __( 'Loading...', 'custom-html-block-extension' ) }
					value={ code }
					options={ editorOptions }
					onChange={ handleOnChange }
					onMount={ handleEditorDidMount }
				/>
			)}
		</div>
	);
};

export default MonacoEditor;
