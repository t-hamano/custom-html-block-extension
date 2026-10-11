/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { AlertDialog, Button, Stack } from '@wordpress/ui';

type ControlsProps = {
	isWaiting: boolean;
	isDirty: boolean;
	onUpdateOptions: () => void;
	onResetOptions: () => void | Promise< void >;
};

export default function Controls( {
	isWaiting,
	isDirty,
	onUpdateOptions,
	onResetOptions,
}: ControlsProps ) {
	return (
		<Stack gap="sm">
			<Button disabled={ isWaiting || ! isDirty } onClick={ onUpdateOptions }>
				{ __( 'Save settings', 'custom-html-block-extension' ) }
			</Button>
			<AlertDialog.Root onConfirm={ onResetOptions }>
				<AlertDialog.Trigger render={ <Button variant="outline" disabled={ isWaiting } /> }>
					{ __( 'Reset', 'custom-html-block-extension' ) }
				</AlertDialog.Trigger>
				<AlertDialog.Popup
					title={ __( 'Reset settings', 'custom-html-block-extension' ) }
					description={ __(
						'Are you sure that reset all settings to default values ?',
						'custom-html-block-extension'
					) }
					confirmButtonText={ __( 'Reset settings', 'custom-html-block-extension' ) }
				/>
			</AlertDialog.Root>
		</Stack>
	);
}
