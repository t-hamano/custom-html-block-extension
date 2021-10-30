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

const ScrollBeyondLastColumn = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollBeyondLastColumn: undefined !== value ? toNumber( value, 0, 20 ) : 5,
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __(
					'Number of columns to scroll past the last column',
					'custom-html-block-extension'
				) }
				value={ editorOptions.scrollBeyondLastColumn }
				min="0"
				max="20"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __(
						'Number of columns to scroll past the last column',
						'custom-html-block-extension'
					) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>
								{ sprintf(
									/* translators: %d is replaced with the number of columns. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									0
								) }
							</h3>
							<img
								src={
									chbeObj.assetPath +
									'/assets/images/admin/editor-config/editor-options/scroll-beyond-last-column_1.gif'
								}
								alt={ sprintf(
									/* translators: %d is replaced with the number of columns. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									0
								) }
							/>
						</div>
						<div className="chbe-modal__col">
							<h3>
								{ sprintf(
									/* translators: %d is replaced with the number of columns. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									20
								) }
							</h3>
							<img
								src={
									chbeObj.assetPath +
									'/assets/images/admin/editor-config/editor-options/scroll-beyond-last-column_2.gif'
								}
								alt={ sprintf(
									/* translators: %d is replaced with the number of columns. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									20
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

export default ScrollBeyondLastColumn;
