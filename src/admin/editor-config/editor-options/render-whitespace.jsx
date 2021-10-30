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

import { PanelRow, SelectControl, Button, Modal } from '@wordpress/components';

const RenderWhitespace = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			renderWhitespace: value,
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Rendering of whitespace', 'custom-html-block-extension' ) }
				value={ editorOptions.renderWhitespace }
				options={ [
					{ label: __( 'All', 'custom-html-block-extension' ), value: 'all' },
					{
						label: __(
							'Render whitespace other than single spaces between words',
							'custom-html-block-extension'
						),
						value: 'boundary',
					},
					{
						label: __(
							'Render only whitespace in the selected text',
							'custom-html-block-extension'
						),
						value: 'selection',
					},
					{
						label: __( 'Render only trailing whitespace', 'custom-html-block-extension' ),
						value: 'trailing',
					},
					{ label: __( 'None', 'custom-html-block-extension' ), value: 'none' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Rendering of whitespace', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'All', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'all' === editorOptions.renderWhitespace }
								isTertiary={ 'all' !== editorOptions.renderWhitespace }
								onClick={ () => {
									handleChange( 'all' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/render-whitespace_1.jpg'
									}
									alt={ __( 'All', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>
								{ __(
									'Render whitespace other than single spaces between words',
									'custom-html-block-extension'
								) }
							</h3>
							<Button
								isPrimary={ 'boundary' === editorOptions.renderWhitespace }
								isTertiary={ 'boundary' !== editorOptions.renderWhitespace }
								onClick={ () => {
									handleChange( 'boundary' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/render-whitespace_2.jpg'
									}
									alt={ __(
										'Render whitespace other than single spaces between words',
										'custom-html-block-extension'
									) }
								/>
							</Button>
						</div>
					</div>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>
								{ __(
									'Render only whitespace in the selected text',
									'custom-html-block-extension'
								) }
							</h3>
							<Button
								isPrimary={ 'selection' === editorOptions.renderWhitespace }
								isTertiary={ 'selection' !== editorOptions.renderWhitespace }
								onClick={ () => {
									handleChange( 'selection' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/render-whitespace_3.jpg'
									}
									alt={ __(
										'Render only whitespace in the selected text',
										'custom-html-block-extension'
									) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Render only trailing whitespace', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'trailing' === editorOptions.renderWhitespace }
								isTertiary={ 'trailing' !== editorOptions.renderWhitespace }
								onClick={ () => {
									handleChange( 'trailing' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/render-whitespace_4.jpg'
									}
									alt={ __( 'Render only trailing whitespace', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'None (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'none' === editorOptions.renderWhitespace }
								isTertiary={ 'none' !== editorOptions.renderWhitespace }
								onClick={ () => {
									handleChange( 'none' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/render-whitespace_5.jpg'
									}
									alt={ __( 'None (default)', 'custom-html-block-extension' ) }
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

export default RenderWhitespace;
