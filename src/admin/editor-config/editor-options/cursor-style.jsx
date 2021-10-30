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

const CursorStyle = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorStyle: value,
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Cursor style', 'custom-html-block-extension' ) }
				value={ editorOptions.cursorStyle }
				options={ [
					{ label: __( 'Line', 'custom-html-block-extension' ), value: 'line' },
					{ label: __( 'Thin line', 'custom-html-block-extension' ), value: 'line-thin' },
					{ label: __( 'Block', 'custom-html-block-extension' ), value: 'block' },
					{ label: __( 'Outline', 'custom-html-block-extension' ), value: 'block-outline' },
					{ label: __( 'Underline', 'custom-html-block-extension' ), value: 'underline' },
					{ label: __( 'Thin underline', 'custom-html-block-extension' ), value: 'underline-thin' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Cursor style', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Line (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'line' === editorOptions.cursorStyle }
								isTertiary={ 'line' !== editorOptions.cursorStyle }
								onClick={ () => {
									handleChange( 'line' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-style_1.jpg'
									}
									alt={ __( 'Line (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Thin line', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'line-thin' === editorOptions.cursorStyle }
								isTertiary={ 'line-thin' !== editorOptions.cursorStyle }
								onClick={ () => {
									handleChange( 'line-thin' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-style_2.jpg'
									}
									alt={ __( 'Thin line', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Block', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'block' === editorOptions.cursorStyle }
								isTertiary={ 'block' !== editorOptions.cursorStyle }
								onClick={ () => {
									handleChange( 'block' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-style_3.jpg'
									}
									alt={ __( 'Block', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Outline', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'block-outline' === editorOptions.cursorStyle }
								isTertiary={ 'block-outline' !== editorOptions.cursorStyle }
								onClick={ () => {
									handleChange( 'block-outline' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-style_4.jpg'
									}
									alt={ __( 'Outline', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Underline', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'underline' === editorOptions.cursorStyle }
								isTertiary={ 'underline' !== editorOptions.cursorStyle }
								onClick={ () => {
									handleChange( 'underline' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-style_5.jpg'
									}
									alt={ __( 'Underline', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Thin underline', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'underline-thin' === editorOptions.cursorStyle }
								isTertiary={ 'underline-thin' !== editorOptions.cursorStyle }
								onClick={ () => {
									handleChange( 'underline-thin' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/cursor-style_6.jpg'
									}
									alt={ __( 'Thin underline', 'custom-html-block-extension' ) }
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

export default CursorStyle;
