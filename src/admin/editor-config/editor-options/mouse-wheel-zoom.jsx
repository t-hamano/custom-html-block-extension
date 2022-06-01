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

const MouseWheelZoom = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			mouseWheelZoom: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Ctrl + mouse wheel to zoom in / out', 'custom-html-block-extension' ) }
				checked={ editorOptions.mouseWheelZoom }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Ctrl + mouse wheel to zoom in / out', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Defaults to disable.', 'custom-html-block-extension' ) }</p>
					<img
						src={
							chbeObj.pluginUrl +
							'/assets/images/admin/editor-config/editor-options/mouse-wheel-zoom.gif'
						}
						alt={ __( 'Enable', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.mouseWheelZoom }
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

export default MouseWheelZoom;
