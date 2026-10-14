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
import { getSampleCode } from './editor-config/components/editor-preview/sample-code';
import type { AdminContextType, AdminTab, PreviewLanguage } from '../types';

/**
 * Context
 */
export const AdminContext = createContext< AdminContextType >( {} as AdminContextType );

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
	const [ code, setCode ] = useState( getSampleCode );
	const [ previewLanguage, setPreviewLanguage ] = useState< PreviewLanguage >( 'html' );
	const [ selectedTab, setSelectedTab ] = useState< AdminTab >( 'editor-config' );

	return (
		<div className={ clsx( 'chbe-admin', { 'is-waiting': isWaiting } ) }>
			<Snackbars />
			{ isWaiting && (
				<div className="chbe-admin__loading">
					<Spinner />
				</div>
			) }
			<Header />
			<Tabs.Root
				className="chbe-admin__tab-panel"
				value={ selectedTab }
				onValueChange={ ( value: AdminTab ) => setSelectedTab( value ) }
			>
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
							previewLanguage,
							isWaiting,
							editorSettings,
							editorOptions,
							savedEditorConfig,
							options,
							selectedTab,
							setCode,
							setPreviewLanguage,
							setIsWaiting,
							setEditorOptions,
							setEditorSettings,
							setSavedEditorConfig,
							setOptions,
							setSelectedTab,
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
