/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, CheckboxControl, Dialog, Stack, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { isClampedItem, type ImportItem } from '../../utils';

type SkippedItem = {
	path: string;
	code: string;
	message: string;
};

type ImportConfirmDialogProps = {
	items: ImportItem[];
	skipped: SkippedItem[];
	onApply: ( items: ImportItem[] ) => void;
	onClose: () => void;
};

function formatValue( value: unknown ) {
	return JSON.stringify( value ) ?? '';
}

function getItemKey( item: ImportItem ) {
	return `${ item.group }.${ item.path }`;
}

function getItemDescription( item: ImportItem ) {
	if ( isClampedItem( item ) ) {
		return sprintf(
			/* translators: 1: Current value, 2: New value, 3: Imported value out of range. */
			__( '%1$s → %2$s (%3$s is out of range)', 'custom-html-block-extension' ),
			formatValue( item.currentValue ),
			formatValue( item.value ),
			formatValue( item.originalValue )
		);
	}
	return sprintf(
		/* translators: 1: Current value, 2: New value. */
		__( '%1$s → %2$s', 'custom-html-block-extension' ),
		formatValue( item.currentValue ),
		formatValue( item.value )
	);
}

export default function ImportConfirmDialog( {
	items,
	skipped,
	onApply,
	onClose,
}: ImportConfirmDialogProps ) {
	const [ checkedKeys, setCheckedKeys ] = useState(
		() => new Set( items.map( ( item ) => getItemKey( item ) ) )
	);

	const onCheckedChange = ( item: ImportItem, checked: boolean ) => {
		setCheckedKeys( ( current ) => {
			const next = new Set( current );
			if ( checked ) {
				next.add( getItemKey( item ) );
			} else {
				next.delete( getItemKey( item ) );
			}
			return next;
		} );
	};

	return (
		<Dialog.Root
			open
			onOpenChange={ ( open ) => {
				if ( ! open ) {
					onClose();
				}
			} }
		>
			<Dialog.Popup size="medium">
				<Dialog.Header>
					<Dialog.Title>
						{ __( 'Import editor config', 'custom-html-block-extension' ) }
					</Dialog.Title>
					<Dialog.CloseIconButton />
				</Dialog.Header>
				<Dialog.Content>
					<Stack direction="column" gap="lg">
						<Text render={ <p /> }>
							{ __(
								'Select the settings to apply. They are applied as unsaved changes, so check the preview and save them.',
								'custom-html-block-extension'
							) }
						</Text>
						<Stack direction="column" gap="md">
							<Text variant="heading-lg" render={ <h3 /> }>
								{ sprintf(
									/* translators: %d: Number of settings. */
									__( 'Settings to apply (%d)', 'custom-html-block-extension' ),
									items.length
								) }
							</Text>
							{ items.map( ( item ) => (
								<CheckboxControl
									key={ getItemKey( item ) }
									label={ item.path }
									description={ getItemDescription( item ) }
									checked={ checkedKeys.has( getItemKey( item ) ) }
									onCheckedChange={ ( checked ) => onCheckedChange( item, checked ) }
								/>
							) ) }
						</Stack>
						{ skipped.length > 0 && (
							<Stack direction="column" gap="md">
								<Text variant="heading-lg" render={ <h3 /> }>
									{ sprintf(
										/* translators: %d: Number of settings. */
										__( 'Skipped settings (%d)', 'custom-html-block-extension' ),
										skipped.length
									) }
								</Text>
								<ul
									className="chbe-admin-tools__import-skipped"
									aria-label={ __( 'Skipped settings', 'custom-html-block-extension' ) }
									// Make the scrollable list reachable with the keyboard.
									tabIndex={ 0 }
								>
									{ skipped.map( ( item, index ) => (
										<li key={ `${ item.path }-${ index }` }>
											<code>{ item.path }</code>: { item.message }
										</li>
									) ) }
								</ul>
							</Stack>
						) }
					</Stack>
				</Dialog.Content>
				<Dialog.Footer>
					<Dialog.Action variant="outline">
						{ __( 'Cancel', 'custom-html-block-extension' ) }
					</Dialog.Action>
					<Button
						disabled={ checkedKeys.size === 0 }
						onClick={ () =>
							onApply( items.filter( ( item ) => checkedKeys.has( getItemKey( item ) ) ) )
						}
					>
						{ __( 'Apply', 'custom-html-block-extension' ) }
					</Button>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}
