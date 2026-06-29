/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { info } from '@wordpress/icons';
import {
	Button,
	Modal,
	ToggleControl,
	__experimentalText as Text,
	__experimentalHeading as Heading,
	__experimentalVStack as VStack,
} from '@wordpress/components';

type ItemHelpProps = {
	title: string;
	description?: ReactNode;
	// `readonly` lets callers pass `as const` arrays so their option values keep
	// their literal types instead of widening to `string`.
	items?: readonly {
		label: string;
		value: string | number | boolean;
		image?: string;
		isDefault?: boolean;
		title?: string;
		description?: string;
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
		<>
			{ isModalOpen && (
				<Modal
					title={ title }
					className="chbe-admin-editor-config-item-help-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<VStack spacing={ 4 } alignment="start">
						{ description && (
							<VStack
								as={ typeof description === 'object' ? 'div' : 'p' }
								className="chbe-admin-editor-config-item-help-modal__decription"
							>
								{ description }
							</VStack>
						) }
						{ isToggle && (
							<Text as="p">
								{ defaultToggle
									? __( 'Defaults to enable.', 'custom-html-block-extension' )
									: __( 'Defaults to disable.', 'custom-html-block-extension' ) }
							</Text>
						) }
						{ items.length > 0 && (
							<div
								className={ `chbe-admin-editor-config-item-help-modal__items is-col-${ colCount }` }
							>
								{ items.map( ( item, index ) => (
									<VStack spacing="4" alignment="start" key={ index }>
										<Heading as="h3" level="4">
											{ item.isDefault
												? sprintf(
														/* translators: %s is replaced with the setting label. */
														__( '%s (Default)', 'custom-html-block-extension' ),
														item.label
												  )
												: item.label }
										</Heading>
										<Button
											className="chbe-admin-editor-config-item-help-modal__item-button"
											variant={ value === item.value ? 'primary' : undefined }
											onClick={ () => {
												onChange?.( item.value );
												setIsModalOpen( false );
											} }
										>
											<img
												src={ `${ window.chbeObj.pluginUrl }/assets/images/admin/editor-config/${ item.image }` }
												alt={ item.title }
											/>
										</Button>
										{ item.description && <Text as="p">{ item.description }</Text> }
									</VStack>
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
							<ToggleControl
								checked={ Boolean( value ) }
								onChange={ ( newValue ) => {
									onChange?.( newValue );
									setIsModalOpen( false );
								} }
								label={ title }
							/>
						) }
					</VStack>
				</Modal>
			) }
			<Button
				className="chbe-admin-editor-config-item-help-toggle"
				icon={ info }
				iconSize={ 20 }
				label={ __( 'Information', 'custom-html-block-extension' ) }
				onClick={ () => setIsModalOpen( true ) }
				size="small"
			/>
		</>
	);
}
