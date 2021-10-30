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

const DragAndDrop = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			dragAndDrop: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Moving selections via drag and drop', 'custom-html-block-extension' ) }
				checked={ editorOptions.dragAndDrop }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Moving selections via drag and drop', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Defaults to disable.', 'custom-html-block-extension' ) }</p>
					<img
						src={
							chbeObj.assetPath +
							'/assets/images/admin/editor-config/editor-options/drag-and-drop.gif'
						}
						alt={ __( 'Moving selections via drag and drop', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.dragAndDrop }
						onChange={ ( value ) => {
							handleChange( value );
							setIsModalOpen( false );
						} }
					/>
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

export default DragAndDrop;
