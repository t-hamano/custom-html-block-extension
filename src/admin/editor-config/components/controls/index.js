/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

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
						__next40pxDefaultSize
					>
						{ __( 'Save settings', 'custom-html-block-extension' ) }
					</Button>
				</li>
				<li className="chbe-admin-editor-config-controls__item">
					<Button
						className="chbe-admin-editor-config-controls__reset"
						variant="secondary"
						disabled={ isWaiting }
						onClick={ () => setIsModalOpen( true ) }
						__next40pxDefaultSize
					>
						{ __( 'Reset', 'custom-html-block-extension' ) }
					</Button>
				</li>
			</ul>
			{ isModalOpen && (
				<ConfirmDialog
					onConfirm={ () => {
						onResetOptions();
						setIsModalOpen( false );
					} }
					onCancel={ () => setIsModalOpen( false ) }
					confirmButtonText={ __( 'Reset settings', 'custom-html-block-extension' ) }
				>
					{ __(
						'Are you sure that reset all settings to default values ?',
						'custom-html-block-extension'
					) }
				</ConfirmDialog>
			) }
		</>
	);
}
