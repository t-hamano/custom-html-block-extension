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

const VerticalScrollbarSize = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				verticalScrollbarSize: value ? toNumber( value, 5, 30 ) : 10,
			},
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Vertical scrollbar size', 'custom-html-block-extension' ) }
				value={ editorOptions.scrollbar.verticalScrollbarSize }
				min="5"
				max="30"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Vertical scrollbar size', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>
								{ sprintf(
									/* translators: %d is replaced with the number of vertical scrollbar size. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									10
								) }
							</h3>
							<img
								src={
									chbeObj.pluginUrl +
									'/assets/images/admin/editor-config/editor-options/scrollbar/vertical-scrollbar-size_1.jpg'
								}
								alt={ sprintf(
									/* translators: %d is replaced with the number of vertical scrollbar size. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									10
								) }
							/>
						</div>
						<div className="chbe-modal__col">
							<h3>
								{ sprintf(
									/* translators: %d is replaced with the number of vertical scrollbar size. */
									__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
									30
								) }
							</h3>
							<img
								src={
									chbeObj.pluginUrl +
									'/assets/images/admin/editor-config/editor-options/scrollbar/vertical-scrollbar-size_2.jpg'
								}
								alt={ sprintf(
									/* translators: %d is replaced with the number of vertical scrollbar size. */
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

export default VerticalScrollbarSize;
