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
	BaseControl,
	ButtonGroup,
	Button,
	Modal
} from '@wordpress/components';

const Minimap = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				side: value
			}
		});
	};

	return (
		<PanelRow>
			<BaseControl
				id="custom-html-block-extension/minimap/side"
				label={ __( 'Position', 'custom-html-block-extension' ) }
			>
				<ButtonGroup>
					<Button
						isPrimary={ 'left' === editorOptions.minimap.side }
						onClick={ () => handleChange( 'left' ) }
					>
						{ __( 'Left', 'custom-html-block-extension' ) }
					</Button>
					<Button
						isPrimary={ 'right' === editorOptions.minimap.side }
						onClick={ () => handleChange( 'right' ) }
					>
						{ __( 'Right', 'custom-html-block-extension' ) }
					</Button>
				</ButtonGroup>
			</BaseControl>
			{ isModalOpen && (
				<Modal
					title={ __( 'Position', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Left', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'left' === editorOptions.minimap.side }
								isTertiary={ 'left' !== editorOptions.minimap.side }
								onClick={ () => {
									handleChange( 'left' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/side_1.jpg' }
									alt={ __( 'Left', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Right (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'right' === editorOptions.minimap.side }
								isTertiary={ 'right' !== editorOptions.minimap.side }
								onClick={ () => {
									handleChange( 'right' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/side_2.jpg' }
									alt={ __( 'Right (default)', 'custom-html-block-extension' ) }
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

export default Minimap;
