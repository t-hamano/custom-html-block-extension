/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'lib/helper';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import { PanelRow, RangeControl, Button, Modal } from '@wordpress/components';

const PaddingBottom = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			padding: {
				...editorOptions.padding,
				bottom: value ? toNumber( value, 0, 50 ) : 0,
			},
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Padding bottom (px)', 'custom-html-block-extension' ) }
				value={ editorOptions.padding.bottom }
				min="0"
				max="50"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Padding bottom (px)', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Spacing between bottom edge of editor and last line.',
							'custom-html-block-extension'
						) }
					</p>
					<p>
						{ __(
							'Note: This setting will not work if "Scroll past the last line" is enabled in "Mouse and Scroll" category.',
							'custom-html-block-extension'
						) }
					</p>
					<img
						src={
							chbeObj.assetPath +
							'/assets/images/admin/editor-config/editor-options/padding/bottom.gif'
						}
						alt={ __( 'Padding bottom (px)', 'custom-html-block-extension' ) }
					/>
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

export default PaddingBottom;
