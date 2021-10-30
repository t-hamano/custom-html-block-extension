/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import { toNumber } from 'admin/common/helper';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import { PanelRow, RangeControl, Button, Modal } from '@wordpress/components';

const WordWrapColumn = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			wordWrapColumn: value ? toNumber( value, 20, 200 ) : 80,
		} );
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Word wrap column', 'custom-html-block-extension' ) }
				value={ editorOptions.wordWrapColumn }
				min="20"
				max="200"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Word wrap column', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<img
						src={
							chbeObj.assetPath +
							'/assets/images/admin/editor-config/editor-options/word-wrap-column.gif'
						}
						alt={ __( 'Word wrap column', 'custom-html-block-extension' ) }
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

export default WordWrapColumn;
