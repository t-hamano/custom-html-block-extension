/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { EditorConfigContext } from 'admin/editor-config';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import { PanelRow, SelectControl, Button, Modal } from '@wordpress/components';

const AutoIndent = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { refreshEditor } = useContext( EditorConfigContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			autoIndent: value,
		} );
		refreshEditor();
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Auto indent', 'custom-html-block-extension' ) }
				value={ editorOptions.autoIndent }
				options={ [
					{ label: __( 'None', 'custom-html-block-extension' ), value: 'none' },
					{ label: __( 'Keep', 'custom-html-block-extension' ), value: 'keep' },
					{ label: __( 'Advanced', 'custom-html-block-extension' ), value: 'advanced' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Auto indent', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'None', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'none' === editorOptions.autoIndent }
								isTertiary={ 'none' !== editorOptions.autoIndent }
								onClick={ () => {
									handleChange( 'none' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/auto-indent_1.gif'
									}
									alt={ __( 'None', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Keep', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'keep' === editorOptions.autoIndent }
								isTertiary={ 'keep' !== editorOptions.autoIndent }
								onClick={ () => {
									handleChange( 'keep' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/auto-indent_2.gif'
									}
									alt={ __( 'Keep', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Advanced (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'advanced' === editorOptions.autoIndent }
								isTertiary={ 'advanced' !== editorOptions.autoIndent }
								onClick={ () => {
									handleChange( 'advanced' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/auto-indent_3.gif'
									}
									alt={ __( 'Advanced (default)', 'custom-html-block-extension' ) }
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

export default AutoIndent;
