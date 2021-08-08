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

const Minimap = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				size: value
			}
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Size', 'custom-html-block-extension' ) }
				value={ editorOptions.minimap.size }
				options={ [
					{ label: __( 'Same as editor\'s content', 'custom-html-block-extension' ), value: 'proportional' },
					{ label: __( 'Automatically zoom in or out', 'custom-html-block-extension' ), value: 'fill' },
					{ label: __( 'Automatically shrink', 'custom-html-block-extension' ), value: 'fit' }
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Size', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
				<div className="chbe-modal__row">
					<div className="chbe-modal__col">
						<h3>{ __( 'Same as editor\'s content (default)', 'custom-html-block-extension' ) }</h3>
						<Button
							isPrimary={ 'proportional' === editorOptions.minimap.size }
							isTertiary={ 'proportional' !== editorOptions.minimap.size }
							onClick={ () => {
								handleChange( 'proportional' );
								setIsModalOpen( false );
							}}
						>
							<img
								src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/size_1.jpg' }
								alt={ __( 'Same as editor\'s content (default)', 'custom-html-block-extension' ) }
							/>
						</Button>
						<p>{ __( 'Minimap size is the same as the contents (which may scroll) .', 'custom-html-block-extension' ) }</p>
					</div>
					<div className="chbe-modal__col">
						<h3>{ __( 'Automatically zoom in or out', 'custom-html-block-extension' ) }</h3>
						<Button
							isPrimary={ 'fill' === editorOptions.minimap.size }
							isTertiary={ 'fill' !== editorOptions.minimap.size }
							onClick={ () => {
								handleChange( 'fill' );
								setIsModalOpen( false );
							}}
						>
							<img
								src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/size_2.jpg' }
								alt={ __( 'Automatically zoom in or out', 'custom-html-block-extension' ) }
							/>
						</Button>
						<p>{ __( 'Minimap will zoom in or out  as needed (not scroll) .', 'custom-html-block-extension' ) }</p>
					</div>
					<div className="chbe-modal__col">
						<h3>{ __( 'Automatically shrink', 'custom-html-block-extension' ) }</h3>
						<Button
							isPrimary={ 'fit' === editorOptions.minimap.size }
							isTertiary={ 'fit' !== editorOptions.minimap.size }
							onClick={ () => {
								handleChange( 'fit' );
								setIsModalOpen( false );
							}}
						>
							<img
								src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/minimap/size_3.jpg' }
								alt={ __( 'Automatically shrink', 'custom-html-block-extension' ) }
							/>
						</Button>
						<p>{ __( 'Minimap will shrink as needed (not scroll) .', 'custom-html-block-extension' ) }</p>
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
