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

import { PanelRow, BaseControl, ButtonGroup, Button, Modal } from '@wordpress/components';

const MultiCursorModifier = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorModifier: value,
		} );
	};

	return (
		<PanelRow>
			<BaseControl
				id="custom-html-block-extension/multi-cursor-modifier"
				label={ __( 'Multi cursor modifier key', 'custom-html-block-extension' ) }
			>
				<ButtonGroup>
					<Button
						isPrimary={ 'alt' === editorOptions.multiCursorModifier }
						onClick={ () => handleChange( 'alt' ) }
					>
						{ __( 'Alt (Option)', 'custom-html-block-extension' ) }
					</Button>
					<Button
						isPrimary={ 'ctrlCmd' === editorOptions.multiCursorModifier }
						onClick={ () => handleChange( 'ctrlCmd' ) }
					>
						{ __( 'Ctrl (Command)', 'custom-html-block-extension' ) }
					</Button>
				</ButtonGroup>
			</BaseControl>
			{ isModalOpen && (
				<Modal
					title={ __( 'Multi cursor modifier key', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'You can use multiple cursors for faster editing. Sets the key for applying multiple cursors with modifier key + Click.',
							'custom-html-block-extension'
						) }
					</p>
					<img
						src={
							chbeObj.assetPath +
							'/assets/images/admin/editor-config/editor-options/multi-cursor-modifier.gif'
						}
						alt={ __( 'Multi cursor modifier key', 'custom-html-block-extension' ) }
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

export default MultiCursorModifier;
