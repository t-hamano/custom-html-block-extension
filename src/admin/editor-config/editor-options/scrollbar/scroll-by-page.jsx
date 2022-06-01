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

const ScrollByPage = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				scrollByPage: value,
			},
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Scroll by page', 'custom-html-block-extension' ) }
				checked={ editorOptions.scrollbar.scrollByPage }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Scroll by page', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Scroll by page when the scroll bar is clicked.',
							'custom-html-block-extension'
						) }
					</p>
					<p>{ __( 'Defaults to disable.', 'custom-html-block-extension' ) }</p>
					<img
						src={
							chbeObj.pluginUrl +
							'/assets/images/admin/editor-config/editor-options/scrollbar/scroll-by-page.gif'
						}
						alt={ __( 'Scroll by page', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.scrollbar.scrollByPage }
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

export default ScrollByPage;
