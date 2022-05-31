/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import {
	PanelRow,
	ToggleControl,
	ExternalLink,
	Modal,
	Notice,
	Button,
	Dashicon,
} from '@wordpress/components';

const Emmet = () => {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorSettings( {
			...editorSettings,
			emmet: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Enable Emmet', 'custom-html-block-extension' ) }
				checked={ editorSettings.emmet }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Emmet', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Emmet is a function for the editor that allow for high-speed coding via content assist.',
							'custom-html-block-extension'
						) }
					</p>
					<p>
						{ __(
							'Only valid for HTML tags and does not support inline CSS in the block and classic editor.',
							'custom-html-block-extension'
						) }
						<br />
						{ __(
							'You can use Emmet if the file extension is html, php, sass, scss, css, or less in the theme/plugin editor.',
							'custom-html-block-extension'
						) }
					</p>
					<p>{ __( 'Defaults to enable.', 'custom-html-block-extension' ) }</p>
					<p>
						<ExternalLink href="https://docs.emmet.io/cheat-sheet/">
							{ __( 'Check Cheat Sheet', 'custom-html-block-extension' ) }
						</ExternalLink>
					</p>
					<img
						src={
							chbeObj.pluginUrl + '/assets/images/admin/editor-config/editor-settings/emmet.gif'
						}
						alt={ __( 'Emmet', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorSettings.emmet }
						onChange={ ( value ) => {
							handleChange( value );
							setIsModalOpen( false );
						} }
					/>
					<Notice status="warning" isDismissible={ false }>
						<Dashicon icon="update" />
						{ __(
							'Save and reload the browser to reflect this settings in the preview editor area.',
							'custom-html-block-extension'
						) }
					</Notice>
				</Modal>
			) }
			<Button
				className="chbe-help"
				icon={ info }
				label={ __( 'Information', 'custom-html-block-extension' ) }
				onClick={ () => setIsModalOpen( true ) }
			></Button>
		</PanelRow>
	);
};

export default Emmet;
