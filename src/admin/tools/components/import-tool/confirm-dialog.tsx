/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';
import { Dialog, Stack, Tabs, Text } from '@wordpress/ui';
import { DataViews, DataViewsPicker } from '@wordpress/dataviews';
import type { ActionButton, Field, View } from '@wordpress/dataviews';

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
	unchanged: ImportItem[];
	skipped: SkippedItem[];
	onApply: ( items: ImportItem[] ) => void;
	onClose: () => void;
};

function formatValue( value: unknown ) {
	return JSON.stringify( value ) ?? '';
}

function renderValue( value: unknown ) {
	return <code>{ formatValue( value ) }</code>;
}

function getItemKey( item: ImportItem ) {
	return `${ item.group }.${ item.path }`;
}

const itemFields: Field< ImportItem >[] = [
	{
		id: 'path',
		label: __( 'Setting', 'custom-html-block-extension' ),
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: 'currentValue',
		label: __( 'Current', 'custom-html-block-extension' ),
		render: ( { item } ) => renderValue( item.currentValue ),
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: 'value',
		label: __( 'New', 'custom-html-block-extension' ),
		render: ( { item } ) =>
			isClampedItem( item )
				? createInterpolateElement(
						sprintf(
							/* translators: 1: New value, 2: Imported value out of range. */
							__( '%1$s (%2$s is out of range)', 'custom-html-block-extension' ),
							'<value />',
							'<original />'
						),
						{ value: renderValue( item.value ), original: renderValue( item.originalValue ) }
					)
				: renderValue( item.value ),
		enableSorting: false,
		enableHiding: false,
	},
];

const unchangedFields: Field< ImportItem >[] = [
	{
		id: 'path',
		label: __( 'Setting', 'custom-html-block-extension' ),
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: 'value',
		label: __( 'Value', 'custom-html-block-extension' ),
		render: ( { item } ) => renderValue( item.value ),
		enableSorting: false,
		enableHiding: false,
	},
];

const skippedFields: Field< SkippedItem >[] = [
	{
		id: 'path',
		label: __( 'Setting', 'custom-html-block-extension' ),
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: 'message',
		label: __( 'Reason', 'custom-html-block-extension' ),
		enableSorting: false,
		enableHiding: false,
	},
];

export default function ImportConfirmDialog( {
	items,
	unchanged,
	skipped,
	onApply,
	onClose,
}: ImportConfirmDialogProps ) {
	const [ selection, setSelection ] = useState( () => items.map( ( item ) => getItemKey( item ) ) );
	const [ itemView, setItemView ] = useState< View >( {
		type: 'pickerTable',
		titleField: 'path',
		fields: [ 'currentValue', 'value' ],
		page: 1,
		perPage: Math.max( items.length, 1 ),
	} );
	const [ unchangedView, setUnchangedView ] = useState< View >( {
		type: 'table',
		titleField: 'path',
		fields: [ 'value' ],
		page: 1,
		perPage: Math.max( unchanged.length, 1 ),
	} );
	const [ skippedView, setSkippedView ] = useState< View >( {
		type: 'table',
		titleField: 'path',
		fields: [ 'message' ],
		page: 1,
		perPage: Math.max( skipped.length, 1 ),
	} );

	const actions: ActionButton< ImportItem >[] = [
		{
			id: 'apply',
			label: __( 'Apply', 'custom-html-block-extension' ),
			isPrimary: true,
			supportsBulk: true,
			callback: ( selectedItems ) => onApply( selectedItems ),
		},
	];

	return (
		<Dialog.Root
			open
			onOpenChange={ ( open ) => {
				if ( ! open ) {
					onClose();
				}
			} }
		>
			<Dialog.Popup size="large">
				<Dialog.Header>
					<Dialog.Title>
						{ __( 'Import editor config', 'custom-html-block-extension' ) }
					</Dialog.Title>
					<Dialog.CloseIconButton />
				</Dialog.Header>
				<Dialog.Content className="chbe-admin-tools__import-dialog-content">
					<Tabs.Root
						className="chbe-admin-tools__import-tabs"
						defaultValue={ items.length > 0 ? 'apply' : 'skipped' }
					>
						<Tabs.List className="chbe-admin-tools__import-tab-list">
							<Tabs.Tab value="apply">
								{ sprintf(
									/* translators: %d: Number of settings. */
									__( 'Settings to apply (%d)', 'custom-html-block-extension' ),
									items.length
								) }
							</Tabs.Tab>
							<Tabs.Tab value="unchanged">
								{ sprintf(
									/* translators: %d: Number of settings. */
									__( 'Unchanged settings (%d)', 'custom-html-block-extension' ),
									unchanged.length
								) }
							</Tabs.Tab>
							<Tabs.Tab value="skipped">
								{ sprintf(
									/* translators: %d: Number of settings. */
									__( 'Skipped settings (%d)', 'custom-html-block-extension' ),
									skipped.length
								) }
							</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="apply" className="chbe-admin-tools__import-panel">
							<Stack direction="column" gap="md" className="chbe-admin-tools__import-panel-content">
								<Text render={ <p /> }>
									{ __(
										'Select the settings to import. They are applied as unsaved changes, so check the preview and save them.',
										'custom-html-block-extension'
									) }
								</Text>
								<DataViewsPicker
									view={ itemView }
									onChangeView={ setItemView }
									fields={ itemFields }
									data={ items }
									getItemId={ getItemKey }
									paginationInfo={ { totalItems: items.length, totalPages: 1 } }
									defaultLayouts={ { pickerTable: true } }
									selection={ selection }
									onChangeSelection={ setSelection }
									actions={ actions }
									itemListLabel={ __( 'Settings to apply', 'custom-html-block-extension' ) }
									empty={ __( 'No settings to apply.', 'custom-html-block-extension' ) }
								>
									<DataViewsPicker.Layout />
									<DataViewsPicker.Footer />
								</DataViewsPicker>
							</Stack>
						</Tabs.Panel>
						<Tabs.Panel value="unchanged" className="chbe-admin-tools__import-panel">
							<Stack direction="column" gap="md" className="chbe-admin-tools__import-panel-content">
								<Text render={ <p /> }>
									{ __(
										'The following settings are the same as the current ones.',
										'custom-html-block-extension'
									) }
								</Text>
								<DataViews
									view={ unchangedView }
									onChangeView={ setUnchangedView }
									fields={ unchangedFields }
									data={ unchanged }
									getItemId={ getItemKey }
									paginationInfo={ { totalItems: unchanged.length, totalPages: 1 } }
									defaultLayouts={ { table: true } }
									empty={ __( 'No settings are unchanged.', 'custom-html-block-extension' ) }
								>
									<DataViews.Layout />
								</DataViews>
							</Stack>
						</Tabs.Panel>
						<Tabs.Panel value="skipped" className="chbe-admin-tools__import-panel">
							<Stack direction="column" gap="md" className="chbe-admin-tools__import-panel-content">
								<Text render={ <p /> }>
									{ __(
										'The following settings cannot be imported.',
										'custom-html-block-extension'
									) }
								</Text>
								<DataViews
									view={ skippedView }
									onChangeView={ setSkippedView }
									fields={ skippedFields }
									data={ skipped }
									getItemId={ ( item ) => item.path }
									paginationInfo={ { totalItems: skipped.length, totalPages: 1 } }
									defaultLayouts={ { table: true } }
									empty={ __( 'No settings were skipped.', 'custom-html-block-extension' ) }
								>
									<DataViews.Layout />
								</DataViews>
							</Stack>
						</Tabs.Panel>
					</Tabs.Root>
				</Dialog.Content>
			</Dialog.Popup>
		</Dialog.Root>
	);
}
