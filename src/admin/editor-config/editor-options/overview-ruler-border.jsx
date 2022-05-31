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

import { PanelRow, ToggleControl, Button, Modal } from '@wordpress/components';

const OverviewRulerBorder = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			overviewRulerBorder: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Show border on scrollbar', 'custom-html-block-extension' ) }
				checked={ editorOptions.overviewRulerBorder }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Show border on scrollbar', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ editorOptions.overviewRulerBorder }
								isTertiary={ ! editorOptions.overviewRulerBorder }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/overview-ruler-border_1.jpg'
									}
									alt={ __( 'Enable (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ ! editorOptions.lineNumbers }
								isTertiary={ editorOptions.lineNumbers }
								onClick={ () => {
									handleChange( false );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/overview-ruler-border_2.jpg'
									}
									alt={ __( 'Disable', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
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

export default OverviewRulerBorder;
