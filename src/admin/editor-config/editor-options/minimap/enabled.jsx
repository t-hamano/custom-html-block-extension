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

const Enabled = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				enabled: value,
			},
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Enable minimap', 'custom-html-block-extension' ) }
				checked={ editorOptions.minimap.enabled }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Minimap', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Minimap gives you a high-level overview of your source code, which is useful for quick navigation and code understanding. You can click or drag the shaded area to quickly jump to different sections.',
							'custom-html-block-extension'
						) }
					</p>
					<p>{ __( 'Defaults to enable.', 'custom-html-block-extension' ) }</p>
					<img
						src={
							chbeObj.assetPath +
							'/assets/images/admin/editor-config/editor-options/minimap/enabled.gif'
						}
						alt={ __( 'Minimap', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.minimap.enabled }
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

export default Enabled;
