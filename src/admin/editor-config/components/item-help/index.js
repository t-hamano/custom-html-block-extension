/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { info } from '@wordpress/icons';
import { Button, Modal, ToggleControl } from '@wordpress/components';

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
} ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const DescriptionTag = typeof description === 'object' ? 'div' : 'p';

	return (
		<>
			{ isModalOpen && (
				<Modal
					title={ title }
					className="chbe-admin-editor-config-item-help-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-admin-editor-config-item-help-modal__content">
						{ description && (
							<DescriptionTag className="chbe-admin-editor-config-item-help-modal__decription">
								{ description }
							</DescriptionTag>
						) }
						{ isToggle && (
							<p>
								{ defaultToggle
									? __( 'Defaults to enable.', 'custom-html-block-extension' )
									: __( 'Defaults to disable.', 'custom-html-block-extension' ) }
							</p>
						) }
						{ items.length > 0 && (
							<div
								className={ `chbe-admin-editor-config-item-help-modal__items is-col-${ colCount }` }
							>
								{ items.map( ( item, index ) => (
									<div className="chbe-admin-editor-config-item-help-modal__item" key={ index }>
										<h3 className="chbe-admin-editor-config-item-help-modal__item-title">
											{ item.isDefault
												? sprintf(
														/* translators: %s is replaced with the setting label. */
														__( '%s (Default)', 'custom-html-block-extension' ),
														item.label
												  )
												: item.label }
										</h3>
										<Button
											className="chbe-admin-editor-config-item-help-modal__item-button"
											variant={ value === item.value ? 'primary' : undefined }
											onClick={ () => {
												onChange( item.value );
												setIsModalOpen( false );
											} }
										>
											<img
												className="chbe-admin-editor-config-item-help-modal__item-image"
												src={ `${ window.chbeObj.pluginUrl }/assets/images/admin/editor-config/${ item.image }` }
												alt={ item.title }
											/>
										</Button>
										{ item.description && <p>{ item.description }</p> }
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
							<ToggleControl
								checked={ value }
								onChange={ ( newValue ) => {
									onChange( newValue );
									setIsModalOpen( false );
								} }
							/>
						) }
					</div>
				</Modal>
			) }
			<Button
				className="chbe-admin-editor-config-item-help-toggle"
				icon={ info }
				label={ __( 'Information', 'custom-html-block-extension' ) }
				onClick={ () => setIsModalOpen( true ) }
			/>
		</>
	);
}
