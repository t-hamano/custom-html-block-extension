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

const RenderCharacters = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ imsModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				renderCharacters: value
			}
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Displays actual characters', 'custom-html-block-extension' ) }
				checked={ editorOptions.minimap.renderCharacters }
				onChange={ handleChange }
			/>
			{ imsModalOpen && (
				<Modal
					title={ __( 'Displays actual characters', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable (default)', 'custom-html-block-extension' ) }</h3>
							<p>{ __( 'Show characters.', 'custom-html-block-extension' ) }</p>
							<Button
								isPrimary={ editorOptions.minimap.renderCharacters }
								isTertiary={ ! editorOptions.minimap.renderCharacters }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/render-characters_1.jpg' }
									alt={ __( 'Show characters.', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable', 'custom-html-block-extension' ) }</h3>
							<p>{ __( 'Show blocks.', 'custom-html-block-extension' ) }</p>
							<Button
								isPrimary={ ! editorOptions.minimap.renderCharacters }
								isTertiary={ editorOptions.minimap.renderCharacters }
								onClick={ () => {
									handleChange( false );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/render-characters_2.jpg' }
									alt={ __( 'Show blocks.', 'custom-html-block-extension' ) }
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

export default RenderCharacters;
