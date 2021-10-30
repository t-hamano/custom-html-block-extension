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

const Vertical = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				vertical: value,
			},
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Vertical scrollbar', 'custom-html-block-extension' ) }
				value={ editorOptions.scrollbar.vertical }
				options={ [
					{ label: __( 'Auto', 'custom-html-block-extension' ), value: 'auto' },
					{ label: __( 'Visible', 'custom-html-block-extension' ), value: 'visible' },
					{ label: __( 'Hidden', 'custom-html-block-extension' ), value: 'hidden' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Vertical scrollbar', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Auto (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'auto' === editorOptions.scrollbar.vertical }
								isTertiary={ 'auto' !== editorOptions.scrollbar.vertical }
								onClick={ () => {
									handleChange( 'auto' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/scrollbar/vertical_1.gif'
									}
									alt={ __( 'Auto (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Visible', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'visible' === editorOptions.scrollbar.vertical }
								isTertiary={ 'visible' !== editorOptions.scrollbar.vertical }
								onClick={ () => {
									handleChange( 'visible' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/scrollbar/vertical_2.jpg'
									}
									alt={ __( 'Visible', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Hidden', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'hidden' === editorOptions.scrollbar.vertical }
								isTertiary={ 'hidden' !== editorOptions.scrollbar.vertical }
								onClick={ () => {
									handleChange( 'hidden' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/scrollbar/vertical_3.jpg'
									}
									alt={ __( 'Hidden', 'custom-html-block-extension' ) }
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

export default Vertical;
