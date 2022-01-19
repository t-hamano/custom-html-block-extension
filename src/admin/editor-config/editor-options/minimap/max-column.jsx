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

const MaxColumn = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				maxColumn: value ? toNumber( value, 10, 60 ) : 60,
			},
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Width', 'custom-html-block-extension' ) }
				value={ editorOptions.minimap.maxColumn }
				min="10"
				max="60"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Width', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<img
						src={
							chbeObj.assetPath +
							'/assets/images/admin/editor-config/editor-options/minimap/max-column.gif'
						}
						alt={ __( 'Width', 'custom-html-block-extension' ) }
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

export default MaxColumn;
