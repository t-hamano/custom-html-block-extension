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

const RenderLineHighlight = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			renderLineHighlight: value
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Highlight current line', 'custom-html-block-extension' ) }
				value={ editorOptions.renderLineHighlight }
				options={ [
					{ label: __( 'Line numbers and the editor content', 'custom-html-block-extension' ), value: 'all' },
					{ label: __( 'Only the editor content', 'custom-html-block-extension' ), value: 'line' },
					{ label: __( 'Only line numbers', 'custom-html-block-extension' ), value: 'gutter' },
					{ label: __( 'None', 'custom-html-block-extension' ), value: 'none' }
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Highlight current line', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Line numbers and the editor content (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'all' === editorOptions.renderLineHighlight }
								isTertiary={ 'all' !== editorOptions.renderLineHighlight }
								onClick={ () => {
									handleChange( 'all' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/render-line-highlight_1.jpg' }
									alt={ __( 'Line numbers and the editor content (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Only the editor content', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'line' === editorOptions.renderLineHighlight }
								isTertiary={ 'line' !== editorOptions.renderLineHighlight }
								onClick={ () => {
									handleChange( 'line' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/render-line-highlight_2.jpg' }
									alt={ __( 'Only the editor content', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Only line numbers', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'gutter' === editorOptions.renderLineHighlight }
								isTertiary={ 'gutter' !== editorOptions.renderLineHighlight }
								onClick={ () => {
									handleChange( 'gutter' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/render-line-highlight_3.jpg' }
									alt={ __( 'Only line numbers', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'None', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'none' === editorOptions.renderLineHighlight }
								isTertiary={ 'none' !== editorOptions.renderLineHighlight }
								onClick={ () => {
									handleChange( 'none' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/render-line-highlight_4.jpg' }
									alt={ __( 'None', 'custom-html-block-extension' ) }
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

export default RenderLineHighlight;
