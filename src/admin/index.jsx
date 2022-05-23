/**
 * External dependencies
 */
import { ReactNotifications } from 'react-notifications-component';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import { htmlCode } from 'lib/helper';
import BlockIcon from 'components/block-icon';
import WelcomeGuide from 'admin/welcome-guide';
import Shortcut from 'admin/shortcut';
import EditorConfig from 'admin/editor-config';
import Tools from 'admin/tools';
import Options from 'admin/options';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { TabPanel, Spinner } from '@wordpress/components';
import { render, createContext, useState } from '@wordpress/element';

/**
 * Context
 */
export const AdminContext = createContext();

const Admin = () => {
	const [ isWaiting, setIsWaiting ] = useState( false );
	const [ editorSettings, setEditorSettings ] = useState( {
		theme: chbeObj.editorSettings.theme,
		tabSize: chbeObj.editorSettings.tabSize,
		insertSpaces: chbeObj.editorSettings.insertSpaces,
		emmet: chbeObj.editorSettings.emmet,
	} );
	const [ editorOptions, setEditorOptions ] = useState( chbeObj.editorOptions );
	const [ options, setOptions ] = useState( chbeObj.options );
	const [ code, setCode ] = useState( htmlCode );

	return (
		<>
			{ isWaiting && (
				<div className="chbe-loading">
					<Spinner />
				</div>
			) }
			<div className={ classnames( 'chbe-wrap', { 'chbe-wrap--is-waiting': isWaiting } ) }>
				<ReactNotifications />
				<header className="chbe-header">
					<div className="chbe-container">
						<h1 className="chbe-header__ttl">
							{ BlockIcon }
							{ __( 'Custom HTML Block Extension', 'custom-html-block-extension' ) }
						</h1>
						<ul className="chbe-header__info">
							<li className="chbe-header__info-item">
								<WelcomeGuide />
							</li>
							<li className="chbe-header__info-item">
								<Shortcut />
							</li>
						</ul>
					</div>
				</header>
				<TabPanel
					className="chbe-tabs"
					tabs={ [
						{
							name: 'editor-config',
							title: __( 'Editor Config', 'custom-html-block-extension' ),
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
						<div className="chbe-container">
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
		</>
	);
};

render( <Admin />, document.getElementById( 'custom-html-block-extension-admin' ) );
