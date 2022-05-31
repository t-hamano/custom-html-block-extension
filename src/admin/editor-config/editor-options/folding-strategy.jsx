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

const FoldingStrategy = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			foldingStrategy: value,
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Folding range strategy', 'custom-html-block-extension' ) }
				value={ editorOptions.foldingStrategy }
				options={ [
					{ label: __( 'Depends on documentation', 'custom-html-block-extension' ), value: 'auto' },
					{
						label: __( 'Depends on indentation', 'custom-html-block-extension' ),
						value: 'indentation',
					},
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Folding range strategy', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Depends on documentation (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'auto' === editorOptions.foldingStrategy }
								isTertiary={ 'auto' !== editorOptions.foldingStrategy }
								onClick={ () => {
									handleChange( 'auto' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/folding-strategy_1.gif'
									}
									alt={ __( 'Depends on documentation (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
							<p>
								{ __(
									'This is effective for folding code that is not indented correctly.',
									'custom-html-block-extension'
								) }
							</p>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Depends on indentation', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'indentation' === editorOptions.foldingStrategy }
								isTertiary={ 'indentation' !== editorOptions.foldingStrategy }
								onClick={ () => {
									handleChange( 'indentation' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/folding-strategy_2.gif'
									}
									alt={ __( 'Depends on indentation', 'custom-html-block-extension' ) }
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

export default FoldingStrategy;
