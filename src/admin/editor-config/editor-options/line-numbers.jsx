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

const LineNumbers = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbers: value,
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Show line numbers', 'custom-html-block-extension' ) }
				value={ editorOptions.lineNumbers }
				options={ [
					{ label: __( 'Hide', 'custom-html-block-extension' ), value: 'off' },
					{ label: __( 'Show', 'custom-html-block-extension' ), value: 'on' },
					{
						label: __( 'Show number of lines to cursor position', 'custom-html-block-extension' ),
						value: 'relative',
					},
					{ label: __( 'Show every 10 lines', 'custom-html-block-extension' ), value: 'interval' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Show line numbers', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Hide', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'off' === editorOptions.lineNumbers }
								isTertiary={ 'off' !== editorOptions.lineNumbers }
								onClick={ () => {
									handleChange( 'off' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/line-numbers_1.jpg'
									}
									alt={ __( 'Hide', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Show (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'on' === editorOptions.lineNumbers }
								isTertiary={ 'on' !== editorOptions.lineNumbers }
								onClick={ () => {
									handleChange( 'on' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/line-numbers_2.jpg'
									}
									alt={ __( 'Show (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>
								{ __( 'Show number of lines to cursor position', 'custom-html-block-extension' ) }
							</h3>
							<Button
								isPrimary={ 'relative' === editorOptions.lineNumbers }
								isTertiary={ 'relative' !== editorOptions.lineNumbers }
								onClick={ () => {
									handleChange( 'relative' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/line-numbers_3.gif'
									}
									alt={ __(
										'Show number of lines to cursor position',
										'custom-html-block-extension'
									) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Show every 10 lines', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'interval' === editorOptions.lineNumbers }
								isTertiary={ 'interval' !== editorOptions.lineNumbers }
								onClick={ () => {
									handleChange( 'interval' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/line-numbers_4.gif'
									}
									alt={ __( 'Show every 10 lines', 'custom-html-block-extension' ) }
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

export default LineNumbers;
