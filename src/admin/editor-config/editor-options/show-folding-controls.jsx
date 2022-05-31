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

const ShowFoldingControls = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			showFoldingControls: value,
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Show code folding icon', 'custom-html-block-extension' ) }
				value={ editorOptions.showFoldingControls }
				options={ [
					{ label: __( 'Always show', 'custom-html-block-extension' ), value: 'always' },
					{ label: __( 'Show on mouseover', 'custom-html-block-extension' ), value: 'mouseover' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Show code folding icon', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Always show', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'always' === editorOptions.showFoldingControls }
								isTertiary={ 'always' !== editorOptions.showFoldingControls }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/show-folding-controls_1.jpg'
									}
									alt={ __( 'Always show', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Show on mouseover (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'mouseover' === editorOptions.showFoldingControls }
								isTertiary={ 'mouseover' !== editorOptions.showFoldingControls }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/show-folding-controls_2.gif'
									}
									alt={ __( 'Show on mouseover (default)', 'custom-html-block-extension' ) }
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

export default ShowFoldingControls;
