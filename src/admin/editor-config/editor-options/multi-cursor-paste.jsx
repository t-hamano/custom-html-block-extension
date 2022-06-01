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

const MultiCursorPaste = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorPaste: value,
		} );
	};

	return (
		<PanelRow>
			<BaseControl
				id="custom-html-block-extension/multi-cursor-paste"
				label={ __(
					'Behaviour when pasting a text with the line count equal to the cursor count',
					'custom-html-block-extension'
				) }
			>
				<ButtonGroup>
					<Button
						isPrimary={ 'spread' === editorOptions.multiCursorPaste }
						onClick={ () => handleChange( 'spread' ) }
					>
						{ __( 'Spread', 'custom-html-block-extension' ) }
					</Button>
					<Button
						isPrimary={ 'full' === editorOptions.multiCursorPaste }
						onClick={ () => handleChange( 'full' ) }
					>
						{ __( 'Full', 'custom-html-block-extension' ) }
					</Button>
				</ButtonGroup>
			</BaseControl>
			{ isModalOpen && (
				<Modal
					title={ __(
						'Behaviour when pasting a text with the line count equal to the cursor count',
						'custom-html-block-extension'
					) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Spread (default)', 'custom-html-block-extension' ) }</h3>
							<p>
								{ __( 'Pastes one line of text at each cursor.', 'custom-html-block-extension' ) }
							</p>
							<Button
								isPrimary={ 'spread' === editorOptions.multiCursorPaste }
								isTertiary={ 'spread' !== editorOptions.multiCursorPaste }
								onClick={ () => {
									handleChange( 'spread' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/multi-cursor-paste_1.gif'
									}
									alt={ __( 'Spread (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Full', 'custom-html-block-extension' ) }</h3>
							<p>{ __( 'Pastes the full text at each cursor.', 'custom-html-block-extension' ) }</p>
							<Button
								isPrimary={ 'full' === editorOptions.multiCursorPaste }
								isTertiary={ 'full' !== editorOptions.multiCursorPaste }
								onClick={ () => {
									handleChange( 'full' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/multi-cursor-paste_2.gif'
									}
									alt={ __( 'Full', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
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

export default MultiCursorPaste;
