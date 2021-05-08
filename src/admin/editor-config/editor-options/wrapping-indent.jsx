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

import {
	PanelRow,
	SelectControl,
	Button,
	Modal
} from '@wordpress/components';

const WrappingIndent = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			wrappingIndent: value
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Word wrap indent', 'custom-html-block-extension' ) }
				value={ editorOptions.wrappingIndent }
				options={ [
					{ label: __( 'None', 'custom-html-block-extension' ), value: 'none' },
					{ label: __( 'Same', 'custom-html-block-extension' ), value: 'same' },
					{ label: __( 'Indent', 'custom-html-block-extension' ), value: 'indent' },
					{ label: __( 'Deep indent', 'custom-html-block-extension' ), value: 'deepIndent' }
				] }
				onChange={ ( value ) => handleChange( value ) }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Word wrap indent', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'None (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'none' === editorOptions.wrappingIndent }
								isTertiary={ 'none' !== editorOptions.wrappingIndent }
								onClick={ () => {
									handleChange( 'none' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/wrapping-indent_1.jpg' }
									alt={ __( 'None (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Same', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'same' === editorOptions.wrappingIndent }
								isTertiary={ 'same' !== editorOptions.wrappingIndent }
								onClick={ () => {
									handleChange( 'same' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/wrapping-indent_2.jpg' }
									alt={ __( 'Same', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Indent', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'indent' === editorOptions.wrappingIndent }
								isTertiary={ 'indent' !== editorOptions.wrappingIndent }
								onClick={ () => {
									handleChange( 'indent' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/wrapping-indent_3.jpg' }
									alt={ __( 'Indent', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Deep indent', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'deepIndent' === editorOptions.wrappingIndent }
								isTertiary={ 'deepIndent' !== editorOptions.wrappingIndent }
								onClick={ () => {
									handleChange( 'deepIndent' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/wrapping-indent_4.jpg' }
									alt={ __( 'Deep indent', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
				</Modal>
			)}
			<Button
				className="chbe-help"
				icon={ info }
				label={ __( 'Information', 'custom-html-block-extension' ) }
				onClick={ () => setIsModalOpen( true ) }
			></Button>
		</PanelRow>
	);
};

export default WrappingIndent;
