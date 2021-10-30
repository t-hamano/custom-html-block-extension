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

const AutoSurround = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			autoSurround: value,
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __(
					'Automatically surround selection with quotes or brackets',
					'custom-html-block-extension'
				) }
				value={ editorOptions.autoSurround }
				options={ [
					{
						label: __( 'Quotes and brackets', 'custom-html-block-extension' ),
						value: 'languageDefined',
					},
					{ label: __( 'Quotes only', 'custom-html-block-extension' ), value: 'quotes' },
					{ label: __( 'Brackets only', 'custom-html-block-extension' ), value: 'brackets' },
					{ label: __( 'Never', 'custom-html-block-extension' ), value: 'never' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __(
						'Automatically surround selection with quotes or brackets',
						'custom-html-block-extension'
					) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Quotes and brackets (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'languageDefined' === editorOptions.autoSurround }
								isTertiary={ 'languageDefined' !== editorOptions.autoSurround }
								onClick={ () => {
									handleChange( 'languageDefined' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/auto-surround_1.gif'
									}
									alt={ __( 'Quotes and brackets (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Quotes only', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'quotes' === editorOptions.autoSurround }
								isTertiary={ 'quotes' !== editorOptions.autoSurround }
								onClick={ () => {
									handleChange( 'quotes' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/auto-surround_2.gif'
									}
									alt={ __( 'Quotes only', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Brackets only', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'brackets' === editorOptions.autoSurround }
								isTertiary={ 'brackets' !== editorOptions.autoSurround }
								onClick={ () => {
									handleChange( 'brackets' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/auto-surround_3.gif'
									}
									alt={ __( 'Brackets only', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Never', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'never' === editorOptions.autoSurround }
								isTertiary={ 'never' !== editorOptions.autoSurround }
								onClick={ () => {
									handleChange( 'never' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/auto-surround_4.gif'
									}
									alt={ __( 'Never', 'custom-html-block-extension' ) }
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

export default AutoSurround;
