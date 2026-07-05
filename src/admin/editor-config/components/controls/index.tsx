/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import { Button, __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

type ControlsProps = {
	isWaiting: boolean;
	onUpdateOptions: () => void;
	onResetOptions: () => void | Promise< void >;
};

export default function Controls( { isWaiting, onUpdateOptions, onResetOptions }: ControlsProps ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const resetButtonRef = useRef< HTMLButtonElement >( null );

	return (
		<>
			<Stack gap="sm">
				<Button
					variant="primary"
					disabled={ isWaiting }
					onClick={ onUpdateOptions }
					__next40pxDefaultSize
					accessibleWhenDisabled
				>
					{ __( 'Save settings', 'custom-html-block-extension' ) }
				</Button>
				<Button
					ref={ resetButtonRef }
					variant="secondary"
					disabled={ isWaiting }
					onClick={ () => setIsModalOpen( true ) }
					__next40pxDefaultSize
					accessibleWhenDisabled
				>
					{ __( 'Reset', 'custom-html-block-extension' ) }
				</Button>
			</Stack>
			{ isModalOpen && (
				<ConfirmDialog
					onConfirm={ async () => {
						setIsModalOpen( false );
						await onResetOptions();
						resetButtonRef.current?.focus();
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
