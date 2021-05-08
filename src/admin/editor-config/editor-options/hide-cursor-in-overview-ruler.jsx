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
	Button,
	Modal
} from '@wordpress/components';

const HideCursorInOverviewRuler = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			hideCursorInOverviewRuler: value
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Hide cursor position on scroll bar', 'custom-html-block-extension' ) }
				checked={ editorOptions.hideCursorInOverviewRuler }
				onChange={ ( value ) => handleChange( value ) }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Hide cursor position on scroll bar', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ editorOptions.hideCursorInOverviewRuler }
								isTertiary={ ! editorOptions.hideCursorInOverviewRuler }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/hide-cursor-in-overview-ruler_1.jpg' }
									alt={ __( 'Enable', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ ! editorOptions.hideCursorInOverviewRuler }
								isTertiary={ editorOptions.hideCursorInOverviewRuler }
								onClick={ () => {
									handleChange( false );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/hide-cursor-in-overview-ruler_2.jpg' }
									alt={ __( 'Disable (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
				</Modal>
			)}
			<Button
				className="chbe-help"
				icon={ info }
				label={ __( 'Information', 'custom-html-block-extension' ) }
				onClick={ () => setIsModalOpen( true ) }
			></Button>
		</PanelRow>
	);
};

export default HideCursorInOverviewRuler;
