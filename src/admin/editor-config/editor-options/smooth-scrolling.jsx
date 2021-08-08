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
	ToggleControl,
	Button,
	Modal
} from '@wordpress/components';

const SmoothScrolling = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			smoothScrolling: value
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Enable smooth scroll', 'custom-html-block-extension' ) }
				checked={ editorOptions.smoothScrolling }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Enable smooth scroll', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ editorOptions.smoothScrolling }
								isTertiary={ ! editorOptions.smoothScrolling }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/smooth-scrolling_1.gif' }
									alt={ __( 'Enable', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ ! editorOptions.smoothScrolling }
								isTertiary={ editorOptions.smoothScrolling }
								onClick={ () => {
									handleChange( false );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/smooth-scrolling_2.gif' }
									alt={ __( 'Disable (default)', 'custom-html-block-extension' ) }
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

export default SmoothScrolling;
