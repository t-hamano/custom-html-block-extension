/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import { Button, Modal } from '@wordpress/components';

const ButtonMenu = ( { isWaiting, handleUpdateOptions, handleResetOptions } ) => {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<>
			<ul className="chbe-button-menu">
				<li className="chbe-button-menu__item">
					<Button
						className="chbe-button-menu__submit"
						isPrimary
						disabled={ isWaiting }
						onClick={ handleUpdateOptions }
					>
						{ __( 'Save Settings', 'custom-html-block-extension' ) }
					</Button>
				</li>
				<li className="chbe-button-menu__item">
					<Button
						className="chbe-button-menu__reset"
						isSecondary
						disabled={ isWaiting }
						onClick={ () => setIsModalOpen( true ) }
					>
						{ __( 'Reset' ) }
					</Button>
				</li>
			</ul>
			{ isModalOpen && (
				<Modal
					title={ __( 'Reset Settings', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Are you sure that reset all settings to default values ?',
							'custom-html-block-extension'
						) }
					</p>
					<div className="chbe-modal__controls">
						<Button
							isPrimary
							onClick={ () => {
								handleResetOptions();
								setIsModalOpen( false );
							} }
						>
							{ __( 'Reset Settings', 'custom-html-block-extension' ) }
						</Button>
						<Button isSecondary onClick={ () => setIsModalOpen( false ) }>
							{ __( 'Cancel', 'custom-html-block-extension' ) }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
};

export default ButtonMenu;
