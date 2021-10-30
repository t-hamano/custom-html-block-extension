/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'admin/common/helper';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import { PanelRow, RangeControl, Button, Modal } from '@wordpress/components';

const SuggestLineHeight = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			suggestLineHeight: value ? toNumber( value, 10, 60 ) : 24,
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Suggest line height (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.suggestLineHeight }
				min="10"
				max="60"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Suggest line height (px)', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>
								{ sprintf(
									/* translators: %d is replaced with the number of line height. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									10
								) }
							</h3>
							<img
								src={
									chbeObj.assetPath +
									'/assets/images/admin/editor-config/editor-options/suggest-line-height_1.jpg'
								}
								alt={ sprintf(
									/* translators: %d is replaced with the number of line height. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									10
								) }
							/>
						</div>
						<div className="chbe-modal__col">
							<h3>
								{ sprintf(
									/* translators: %d is replaced with the number of line height. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									30
								) }
							</h3>
							<img
								src={
									chbeObj.assetPath +
									'/assets/images/admin/editor-config/editor-options/suggest-line-height_2.jpg'
								}
								alt={ sprintf(
									/* translators: %d is replaced with the number of line height. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									30
								) }
							/>
						</div>
					</div>
				</Modal>
			) }
			<Button
				className="chbe-help"
				icon={ info }
				label={ __( 'Information', 'custom-html-block-extension' ) }
				onClick={ () => setIsModalOpen( true ) }
			></Button>
		</PanelRow>
	);
};

export default SuggestLineHeight;
