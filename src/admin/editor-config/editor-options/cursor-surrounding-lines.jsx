/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'lib/helper';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import { PanelRow, RangeControl, Button, Modal } from '@wordpress/components';

const CursorSurroundingLines = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSurroundingLines: value ? toNumber( value, 0, 20 ) : 0,
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __(
					'Number of lines to keep before and after the cursor',
					'custom-html-block-extension'
				) }
				value={ editorOptions.cursorSurroundingLines }
				min="0"
				max="20"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __(
						'Number of lines to keep before and after the cursor',
						'custom-html-block-extension'
					) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Sets the number of lines to keep before and after the cursor when the cursor is moved up and down.',
							'custom-html-block-extension'
						) }
					</p>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>
								{ sprintf(
									/* translators: %d is replaced with the number of lines. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									0
								) }
							</h3>
							<img
								src={
									chbeObj.pluginUrl +
									'/assets/images/admin/editor-config/editor-options/cursor-surrounding-lines_1.gif'
								}
								alt={ sprintf(
									/* translators: %d is replaced with the number of lines. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									0
								) }
							/>
						</div>
						<div className="chbe-modal__col">
							<h3>
								{ sprintf(
									/* translators: %d is replaced with the number of lines. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									5
								) }
							</h3>
							<img
								src={
									chbeObj.pluginUrl +
									'/assets/images/admin/editor-config/editor-options/cursor-surrounding-lines_2.gif'
								}
								alt={ sprintf(
									/* translators: %d is replaced with the number of lines. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									5
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

export default CursorSurroundingLines;
