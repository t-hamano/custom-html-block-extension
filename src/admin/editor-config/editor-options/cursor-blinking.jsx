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

const CursorBlinking = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorBlinking: value,
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Cursor animation style', 'custom-html-block-extension' ) }
				value={ editorOptions.cursorBlinking }
				options={ [
					{ label: __( 'Blink', 'custom-html-block-extension' ), value: 'blink' },
					{ label: __( 'Smooth', 'custom-html-block-extension' ), value: 'smooth' },
					{ label: __( 'Phase', 'custom-html-block-extension' ), value: 'phase' },
					{ label: __( 'Expand', 'custom-html-block-extension' ), value: 'expand' },
					{ label: __( 'Solid', 'custom-html-block-extension' ), value: 'solid' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Cursor animation style', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Blink (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'blink' === editorOptions.cursorBlinking }
								isTertiary={ 'blink' !== editorOptions.cursorBlinking }
								onClick={ () => {
									handleChange( 'blink' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-blinking_1.gif'
									}
									alt={ __( 'Blink (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Smooth', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'smooth' === editorOptions.cursorBlinking }
								isTertiary={ 'smooth' !== editorOptions.cursorBlinking }
								onClick={ () => {
									handleChange( 'smooth' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-blinking_2.gif'
									}
									alt={ __( 'Smooth', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Phase', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'phase' === editorOptions.cursorBlinking }
								isTertiary={ 'phase' !== editorOptions.cursorBlinking }
								onClick={ () => {
									handleChange( 'phase' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-blinking_3.gif'
									}
									alt={ __( 'Phase', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Expand', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'expand' === editorOptions.cursorBlinking }
								isTertiary={ 'expand' !== editorOptions.cursorBlinking }
								onClick={ () => {
									handleChange( 'expand' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-blinking_4.gif'
									}
									alt={ __( 'Expand', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Solid', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'solid' === editorOptions.cursorBlinking }
								isTertiary={ 'solid' !== editorOptions.cursorBlinking }
								onClick={ () => {
									handleChange( 'solid' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-blinking_5.jpg'
									}
									alt={ __( 'Solid', 'custom-html-block-extension' ) }
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

export default CursorBlinking;
