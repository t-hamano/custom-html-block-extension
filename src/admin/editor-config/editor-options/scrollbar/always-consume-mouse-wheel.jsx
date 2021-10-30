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

import { PanelRow, ToggleControl, Button, Modal } from '@wordpress/components';

const AlwaysConsumeMouseWheel = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				alwaysConsumeMouseWheel: value,
			},
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Stop browser scroll', 'custom-html-block-extension' ) }
				checked={ editorOptions.scrollbar.alwaysConsumeMouseWheel }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Stop browser scroll', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ editorOptions.scrollbar.alwaysConsumeMouseWheel }
								isTertiary={ ! editorOptions.scrollbar.alwaysConsumeMouseWheel }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/scrollbar/always-consume-mouse-wheel_1.gif'
									}
									alt={ __( 'Enable (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
							<p>
								{ __(
									'Browser does not scroll when mouse wheel reaches the beginning or end.',
									'custom-html-block-extension'
								) }
							</p>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ ! editorOptions.scrollbar.alwaysConsumeMouseWheel }
								isTertiary={ editorOptions.scrollbar.alwaysConsumeMouseWheel }
								onClick={ () => {
									handleChange( false );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.assetPath +
										'/assets/images/admin/editor-config/editor-options/scrollbar/always-consume-mouse-wheel_2.gif'
									}
									alt={ __( 'Disable', 'custom-html-block-extension' ) }
								/>
							</Button>
							<p>
								{ __(
									'Browser will scroll when mouse wheel reaches the beginning or end.',
									'custom-html-block-extension'
								) }
							</p>
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

export default AlwaysConsumeMouseWheel;
