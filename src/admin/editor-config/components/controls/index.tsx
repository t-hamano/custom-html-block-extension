/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

type ControlsProps = {
	isWaiting: boolean;
	onUpdateOptions: () => void;
	onResetOptions: () => void;
};

export default function Controls( { isWaiting, onUpdateOptions, onResetOptions }: ControlsProps ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<>
			<Stack gap="sm">
				<Button
					variant="primary"
					disabled={ isWaiting }
					onClick={ onUpdateOptions }
					__next40pxDefaultSize
				>
					{ __( 'Save settings', 'custom-html-block-extension' ) }
				</Button>
				<Button
					variant="secondary"
					disabled={ isWaiting }
					onClick={ () => setIsModalOpen( true ) }
					__next40pxDefaultSize
				>
					{ __( 'Reset', 'custom-html-block-extension' ) }
				</Button>
			</Stack>
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
