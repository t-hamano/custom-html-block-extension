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

const ShowSlider = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				showSlider: value
			}
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Show slider', 'custom-html-block-extension' ) }
				value={ editorOptions.minimap.showSlider }
				options={ [
					{ label: __( 'Always show', 'custom-html-block-extension' ), value: 'always' },
					{ label: __( 'Show on mouseover', 'custom-html-block-extension' ), value: 'mouseover' }
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Show slider', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
				<div className="chbe-modal__row">
					<div className="chbe-modal__col">
						<h3>{ __( 'Always show', 'custom-html-block-extension' ) }</h3>
						<Button
							isPrimary={ 'always' === editorOptions.minimap.showSlider }
							isTertiary={ 'always' !== editorOptions.minimap.showSlider }
							onClick={ () => {
								handleChange( 'always' );
								setIsModalOpen( false );
							}}
						>
							<img
								src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/show-slider_1.jpg' }
								alt={ __( 'Always show', 'custom-html-block-extension' ) }
							/>
						</Button>
					</div>
					<div className="chbe-modal__col">
						<h3>{ __( 'Show on mouseover (default)', 'custom-html-block-extension' ) }</h3>
						<Button
							isPrimary={ 'mouseover' === editorOptions.minimap.showSlider }
							isTertiary={ 'mouseover' !== editorOptions.minimap.showSlider }
							onClick={ () => {
								handleChange( 'mouseover' );
								setIsModalOpen( false );
							}}
						>
							<img
								src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/show-slider_2.gif' }
								alt={ __( 'Show on mouseover (default)', 'custom-html-block-extension' ) }
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

export default ShowSlider;
