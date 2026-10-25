/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { info } from '@wordpress/icons';
import { Badge, Button, Dialog, IconButton, Stack, SwitchControl, Text } from '@wordpress/ui';

type ItemHelpProps = {
	title: string;
	description?: ReactNode;
	items?: {
		label: string;
		value: string | number | boolean;
		image?: string;
		isDefault?: boolean;
		description?: ReactNode;
	}[];
	colCount?: string | number;
	isToggle?: boolean;
	defaultToggle?: boolean;
	image?: string;
	value?: string | number | boolean;
	// `any` lets callers pass boolean/number/string handlers without
	// contravariance errors; the component only forwards an item's `value`.
	onChange?: ( value: any ) => void;
};

export default function ItemHelp( {
	title,
	description,
	items = [],
	colCount = 2,
	isToggle,
	defaultToggle,
	image,
	value,
	onChange,
}: ItemHelpProps ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<Dialog.Root open={ isModalOpen } onOpenChange={ setIsModalOpen }>
			<Dialog.Trigger
				className="chbe-admin-editor-config-item-help-toggle"
				render={
					<IconButton
						icon={ info }
						label={ __( 'Information', 'custom-html-block-extension' ) }
						variant="minimal"
						tone="neutral"
						size="small"
					/>
				}
			/>
			<Dialog.Popup className="chbe-admin-editor-config-item-help-modal" size="large">
				<Dialog.Header>
					<Dialog.Title>{ title }</Dialog.Title>
					<Dialog.CloseIconButton />
				</Dialog.Header>
				<Dialog.Content>
					<Stack direction="column" align="start" gap="lg">
						{ description && (
							<Text
								render={ <p /> }
								className="chbe-admin-editor-config-item-help-modal__decription"
							>
								{ description }
							</Text>
						) }
						{ isToggle && (
							<Badge intent="informational">
								{ defaultToggle
									? __( 'Default: Enabled', 'custom-html-block-extension' )
									: __( 'Default: Disabled', 'custom-html-block-extension' ) }
							</Badge>
						) }
						{ items.length > 0 && (
							<div
								className={ `chbe-admin-editor-config-item-help-modal__items is-col-${ colCount }` }
							>
								{ items.map( ( item, index ) => (
									<div className="chbe-admin-editor-config-item-help-modal__item" key={ index }>
										<Stack direction="row" align="center" gap="sm">
											<Text variant="heading-lg" render={ <h3 /> }>
												{ item.label }
											</Text>
											{ item.isDefault && (
												<Badge intent="informational">
													{ __( 'Default', 'custom-html-block-extension' ) }
												</Badge>
											) }
										</Stack>
										<Button
											className="chbe-admin-editor-config-item-help-modal__item-button"
											variant={ value === item.value ? 'solid' : 'minimal' }
											onClick={ () => {
												onChange?.( item.value );
												setIsModalOpen( false );
											} }
										>
											<img
												src={ `${ window.chbeObj.pluginUrl }/assets/images/admin/editor-config/${ item.image }` }
												alt={ item.label }
											/>
										</Button>
										{ item.description && (
											<Text
												render={ <p /> }
												className="chbe-admin-editor-config-item-help-modal__item-description"
											>
												{ item.description }
											</Text>
										) }
									</div>
								) ) }
							</div>
						) }
						{ image && (
							<img
								src={ `${ window.chbeObj.pluginUrl }/assets/images/admin/editor-config/${ image }` }
								alt={ title }
							/>
						) }
						{ isToggle && (
							<SwitchControl
								checked={ Boolean( value ) }
								onCheckedChange={ ( newValue ) => {
									onChange?.( newValue );
									setIsModalOpen( false );
								} }
								label={ title }
							/>
						) }
					</Stack>
				</Dialog.Content>
			</Dialog.Popup>
		</Dialog.Root>
	);
}
