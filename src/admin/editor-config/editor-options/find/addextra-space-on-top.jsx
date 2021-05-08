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

const AddExtraSpaceOnTop = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			find: {
				...editorOptions.find,
				addExtraSpaceOnTop: value
			}
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Show search widget above the first line', 'custom-html-block-extension' ) }
				checked={ editorOptions.find.addExtraSpaceOnTop }
				onChange={ ( value ) => handleChange( value ) }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Show search widget above the first line', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ editorOptions.find.addExtraSpaceOnTop }
								isTertiary={ ! editorOptions.find.addExtraSpaceOnTop }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/find/addextra-space-on-top_1.jpg' }
									alt={ __( 'Enable (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ ! editorOptions.find.addExtraSpaceOnTop }
								isTertiary={ editorOptions.find.addExtraSpaceOnTop }
								onClick={ () => {
									handleChange( false );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/find/addextra-space-on-top_2.jpg' }
									alt={ __( 'Disable', 'custom-html-block-extension' ) }
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

export default AddExtraSpaceOnTop;
