/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import { Button, Modal } from '@wordpress/components';

export default function Controls( { isWaiting, onUpdateOptions, onResetOptions } ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<>
			<ul className="chbe-admin-editor-config-controls">
				<li className="chbe-admin-editor-config-controls__item">
					<Button
						className="chbe-admin-editor-config-controls__submit"
						variant="primary"
						disabled={ isWaiting }
						onClick={ onUpdateOptions }
					>
						{ __( 'Save Settings', 'custom-html-block-extension' ) }
					</Button>
				</li>
				<li className="chbe-admin-editor-config-controls__item">
					<Button
						className="chbe-admin-editor-config-controls__reset"
						variant="secondary"
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
					className="chbe-admin-editor-config-controls-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Are you sure that reset all settings to default values ?',
							'custom-html-block-extension'
						) }
					</p>
					<div className="chbe-admin-editor-config-item-help-modal__controls">
						<Button
							variant="primary"
							onClick={ () => {
								onResetOptions();
								setIsModalOpen( false );
							} }
						>
							{ __( 'Reset Settings', 'custom-html-block-extension' ) }
						</Button>
						<Button variant="secondary" onClick={ () => setIsModalOpen( false ) }>
							{ __( 'Cancel', 'custom-html-block-extension' ) }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
}
