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

const GlyphMargin = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			glyphMargin: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Show left margin', 'custom-html-block-extension' ) }
				checked={ editorOptions.glyphMargin }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Show left margin', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Margin at the left edge of the editor.', 'custom-html-block-extension' ) }</p>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ editorOptions.glyphMargin }
								isTertiary={ ! editorOptions.glyphMargin }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/glyph-margin_1.jpg'
									}
									alt={ __( 'Enable', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ ! editorOptions.glyphMargin }
								isTertiary={ editorOptions.glyphMargin }
								onClick={ () => {
									handleChange( false );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/glyph-margin_2.jpg'
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

export default GlyphMargin;
