/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';

/**
 * Internal dependencies
 */
import MonacoEditor from '../components/monaco-editor';
import { parseContent, serializeContent } from './utils';

export default function TabEditor( { content = '', onError, onChange } ) {
	const { editorSettings, editorOptions } = window.chbeObj;
	const [ editedContent, setEditedContent ] = useState( () => parseContent( content ) );

	const tabs = [
		{
			name: 'html',
			title: __( 'HTML', 'custom-html-block-extension' ),
			language: 'html',
		},
		{
			name: 'css',
			title: __( 'CSS', 'custom-html-block-extension' ),
			language: 'css',
		},
		{
			name: 'js',
			title: __( 'JavaScript', 'custom-html-block-extension' ),
			language: 'javascript',
		},
	].filter( Boolean );

	function onChangeTabContent( name, newTabContent ) {
		const newContent = {
			...editedContent,
			[ name ]: newTabContent,
		};
		setEditedContent( newContent );
		onChange( serializeContent( newContent ) );
	}

	return (
		<div className="chbe-tab-editor">
			<TabPanel tabs={ tabs } className="chbe-tab-editor__tab-panel">
				{ ( activeTab ) => {
					return tabs.map( ( tab ) => (
						<div
							key={ tab.name }
							className={ clsx( 'chbe-tab-editor__tab-content', {
								'is-active': activeTab.name === tab.name,
							} ) }
						>
							<MonacoEditor
								language={ tab.language }
								theme={ editorSettings.theme }
								options={ editorOptions }
								value={ editedContent[ tab.name ] ?? '' }
								useEmmet={ editorSettings.emmet }
								tabSize={ editorSettings.tabSize }
								insertSpaces={ editorSettings.insertSpaces }
								onChange={ ( value ) => onChangeTabContent( tab.name, value ) }
								onError={ onError }
							/>
						</div>
					) );
				} }
			</TabPanel>
		</div>
	);
}
