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

const WordWrap = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			wordWrap: value
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Word wrap', 'custom-html-block-extension' ) }
				value={ editorOptions.wordWrap }
				options={ [
					{ label: __( 'Off', 'custom-html-block-extension' ), value: 'off' },
					{ label: __( 'On', 'custom-html-block-extension' ), value: 'on' },
					{ label: __( 'Depends on word wrap column', 'custom-html-block-extension' ), value: 'wordWrapColumn' },
					{ label: __( 'Flexible', 'custom-html-block-extension' ), value: 'bounded' }
				] }
				onChange={ ( value ) => handleChange( value ) }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Word wrap', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Off (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'off' === editorOptions.wordWrap }
								isTertiary={ 'off' !== editorOptions.wordWrap }
								onClick={ () => {
									handleChange( 'off' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/word-wrap_1.jpg' }
									alt={ __( 'Off (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
							<p>{ __( 'The lines will never wrap.', 'custom-html-block-extension' ) }</p>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'On', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'on' === editorOptions.wordWrap }
								isTertiary={ 'on' !== editorOptions.wordWrap }
								onClick={ () => {
									handleChange( 'on' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/word-wrap_2.jpg' }
									alt={ __( 'On', 'custom-html-block-extension' ) }
								/>
							</Button>
							<p>{ __( 'The lines will always wrap.', 'custom-html-block-extension' ) }</p>
						</div>
					</div>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Depends on word wrap column', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'wordWrapColumn' === editorOptions.wordWrap }
								isTertiary={ 'wordWrapColumn' !== editorOptions.wordWrap }
								onClick={ () => {
									handleChange( 'wordWrapColumn' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/word-wrap_3.jpg' }
									alt={ __( 'Depends on word wrap column', 'custom-html-block-extension' ) }
								/>
							</Button>
							<p>{ __( 'The lines will be wrapped according to "Word wrap column" setting.', 'custom-html-block-extension' ) }</p>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Flexible', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'flexible' === editorOptions.wordWrap }
								isTertiary={ 'flexible' !== editorOptions.wordWrap }
								onClick={ () => {
									handleChange( 'bounded' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/word-wrap_4.jpg' }
									alt={ __( 'Flexible', 'custom-html-block-extension' ) }
								/>
							</Button>
							<p>{ __( 'The lines will be wrapped at the lesser of editor\'s width or word wrap column setting.', 'custom-html-block-extension' ) }</p>
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

export default WordWrap;
