/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	__experimentalConfirmDialog as ConfirmDialog,
	__experimentalHStack as HStack,
} from '@wordpress/components';

export default function Controls( { isWaiting, onUpdateOptions, onResetOptions } ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<>
			<HStack>
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
			</HStack>
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
