/**
 * External dependencies
 */
import { ReactNotifications } from 'react-notifications-component';
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { TabPanel, Spinner } from '@wordpress/components';
import { render, createRoot, createContext, useState } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import './style.scss';
import Header from './components/header';
import EditorConfig from './editor-config';
import Tools from './tools';
import Options from './options';

/**
 * Context
 */
export const AdminContext = createContext();

// Sample code based on indent type and tab size settings.
const htmlCode = () => {
	let str = `<div class="container">
	<h2 class="title">Hello World</h2>
	<div class="row">
		<div class="col">
			<h3 class="subheading">Subtitle</h3>
			<img src="image.png" alt="WordPress" width="470" height="317">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
		<div class="col">
			<h3 class="subheading">Subtitle</h3>
			<img src="image.png" alt="WordPress" width="470" height="317">
			<a href="https://wordpress.org/" target="_blank">WordPress.org</a>
		</div>
	</div>
</div>
`;

	const { editorSettings } = window.chbeObj;
	if ( editorSettings.insertSpaces && editorSettings.tabSize ) {
		str = str.replace( /\t/gm, ' '.repeat( window.chbeObj.editorSettings.tabSize ) );
	}
	return str;
};

function Admin() {
	const [ isWaiting, setIsWaiting ] = useState( false );
	const [ editorSettings, setEditorSettings ] = useState( {
		theme: window.chbeObj.editorSettings.theme,
		tabSize: window.chbeObj.editorSettings.tabSize,
		insertSpaces: window.chbeObj.editorSettings.insertSpaces,
		emmet: window.chbeObj.editorSettings.emmet,
	} );
	const [ editorOptions, setEditorOptions ] = useState( window.chbeObj.editorOptions );
	const [ options, setOptions ] = useState( window.chbeObj.options );
	const [ code, setCode ] = useState( htmlCode );

	return (
		<div className={ clsx( 'chbe-admin', { 'is-waiting': isWaiting } ) }>
			<ReactNotifications />
			{ isWaiting && (
				<div className="chbe-admin__loading">
					<Spinner />
				</div>
			) }
			<Header />
			<TabPanel
				className="chbe-admin__tab-panel"
				tabs={ [
					{
						name: 'editor-config',
						title: __( 'Editor config', 'custom-html-block-extension' ),
					},
					{
						name: 'tools',
						title: __( 'Tools', 'custom-html-block-extension' ),
					},
					{
						name: 'options',
						title: __( 'Options', 'custom-html-block-extension' ),
					},
				] }
			>
				{ ( tab ) => (
					<div className="chbe-admin-container">
						<AdminContext.Provider
							value={ {
								code,
								isWaiting,
								editorSettings,
								editorOptions,
								options,
								setCode,
								setIsWaiting,
								setEditorOptions,
								setEditorSettings,
								setOptions,
							} }
						>
							{ 'editor-config' === tab.name && <EditorConfig /> }
							{ 'tools' === tab.name && <Tools /> }
							{ 'options' === tab.name && <Options /> }
						</AdminContext.Provider>
					</div>
				) }
			</TabPanel>
		</div>
	);
}

domReady( function () {
	const domNode = document.getElementById( 'custom-html-block-extension-admin' );

	// If version is less than 18 use `render` to render the app
	// otherwise use `createRoot` to render the app
	if ( createRoot === undefined ) {
		render( <Admin />, domNode );
	} else {
		const root = createRoot( domNode );
		root.render( <Admin /> );
	}
} );
