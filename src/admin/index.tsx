/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Spinner, Stack, Tabs } from '@wordpress/ui';
import { createRoot, createContext, useState } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import './style.scss';
import Snackbars from './components/snackbars';
import Header from './components/header';
import EditorConfig from './editor-config';
import Tools from './tools';
import Options from './options';
import type { AdminContextType } from '../types';

/**
 * Context
 */
export const AdminContext = createContext< AdminContextType >( {} as AdminContextType );

// Sample code based on indent type and tab size settings.
const htmlCode = () => {
	let str = `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
	<!-- wp:heading -->
	<h2 class="wp-block-heading">Hello World</h2>
	<!-- /wp:heading -->
	<!-- wp:columns -->
	<div class="wp-block-columns">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"width":"470px","height":"317px"} -->
			<figure class="wp-block-image is-resized"><img src="image.png" alt="WordPress" width="470" height="317"></figure>
			<!-- /wp:image -->
			<!-- wp:paragraph -->
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:shortcode -->
			[gallery ids="1,2,3" columns="3" size="medium"]
			<!-- /wp:shortcode -->
			<!-- wp:html -->
			[caption id="attachment_1" align="aligncenter"]<a href="https://wordpress.org/" target="_blank">WordPress.org</a>[/caption]
			<!-- /wp:html -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
	<!-- wp:latest-posts {"postsToShow":3} /-->
</div>
<!-- /wp:group -->
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
		detectIndentation: window.chbeObj.editorSettings.detectIndentation,
		emmet: window.chbeObj.editorSettings.emmet,
	} );
	const [ editorOptions, setEditorOptions ] = useState( window.chbeObj.editorOptions );
	const [ savedEditorConfig, setSavedEditorConfig ] = useState( {
		editorSettings,
		editorOptions,
	} );
	const [ options, setOptions ] = useState( window.chbeObj.options );
	const [ code, setCode ] = useState( htmlCode );

	return (
		<div className={ clsx( 'chbe-admin', { 'is-waiting': isWaiting } ) }>
			<Snackbars />
			{ isWaiting && (
				<div className="chbe-admin__loading">
					<Spinner />
				</div>
			) }
			<Header />
			<Tabs.Root className="chbe-admin__tab-panel" defaultValue="editor-config">
				<Stack direction="column" gap="3xl">
					<Tabs.List className="chbe-admin__tab-list">
						<Tabs.Tab value="editor-config">
							{ __( 'Editor config', 'custom-html-block-extension' ) }
						</Tabs.Tab>
						<Tabs.Tab value="tools">{ __( 'Tools', 'custom-html-block-extension' ) }</Tabs.Tab>
						<Tabs.Tab value="options">{ __( 'Options', 'custom-html-block-extension' ) }</Tabs.Tab>
					</Tabs.List>
					<AdminContext.Provider
						value={ {
							code,
							isWaiting,
							editorSettings,
							editorOptions,
							savedEditorConfig,
							options,
							setCode,
							setIsWaiting,
							setEditorOptions,
							setEditorSettings,
							setSavedEditorConfig,
							setOptions,
						} }
					>
						<div className="chbe-admin-container">
							<Tabs.Panel value="editor-config">
								<EditorConfig />
							</Tabs.Panel>
							<Tabs.Panel value="tools">
								<Tools />
							</Tabs.Panel>
							<Tabs.Panel value="options">
								<Options />
							</Tabs.Panel>
						</div>
					</AdminContext.Provider>
				</Stack>
			</Tabs.Root>
		</div>
	);
}

domReady( function () {
	const domNode = document.getElementById( 'custom-html-block-extension-admin' );
	if ( ! domNode ) {
		return;
	}
	const root = createRoot( domNode );
	root.render( <Admin /> );
} );
