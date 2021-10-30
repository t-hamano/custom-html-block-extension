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

const FormatOnPaste = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			formatOnPaste: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Enable format on paste', 'custom-html-block-extension' ) }
				checked={ editorOptions.formatOnPaste }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Enable format on paste', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ editorOptions.formatOnPaste }
								isTertiary={ ! editorOptions.formatOnPaste }
								onClick={ () => {
									handleChange( 'always' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/format-on-paste_1.gif'
									}
									alt={ __( 'Enable', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ ! editorOptions.formatOnPaste }
								isTertiary={ editorOptions.formatOnPaste }
								onClick={ () => {
									handleChange( 'always' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/format-on-paste_2.gif'
									}
									alt={ __( 'Disable (default)', 'custom-html-block-extension' ) }
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

export default FormatOnPaste;
