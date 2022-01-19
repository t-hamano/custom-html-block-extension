/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'common/helper';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import { PanelRow, RangeControl, Button, Modal } from '@wordpress/components';

const LineNumbersMinChars = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbersMinChars: value ? toNumber( value, 1, 10 ) : 5,
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Line number width', 'custom-html-block-extension' ) }
				value={ editorOptions.lineNumbersMinChars }
				min="1"
				max="10"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Line number width', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<img
						src={
							chbeObj.assetPath +
							'/assets/images/admin/editor-config/editor-options/line-numbers-min-chars.gif'
						}
						alt={ __( 'Line number width', 'custom-html-block-extension' ) }
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

export default LineNumbersMinChars;
