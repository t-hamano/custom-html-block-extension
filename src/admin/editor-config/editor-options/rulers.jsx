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

import {
	PanelRow,
	RangeControl,
	Button,
	Modal
} from '@wordpress/components';

const Rulers = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) =>{
		setEditorOptions({
			...editorOptions,
			rulers: ( 0 < value ) ? [ toNumber( value, 1, 80 ) ] : []
		});
	};

	return (
		<PanelRow>
			<RangeControl
				label={ __( 'Vertical line position', 'custom-html-block-extension' ) }
				value={ editorOptions.rulers.length ? editorOptions.rulers[0] : 0 }
				min="0"
				max="80"
				allowReset
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Vertical line position', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Vertical line will be displayed if a value greater than 0 is set.', 'custom-html-block-extension' ) }</p>
					<img
						src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/rulers.gif' }
						alt={ __( 'Vertical line position', 'custom-html-block-extension' ) }
					/>
				</Modal>
			)}
			<Button
				className="chbe-help"
				icon={ info }
				label={ __( 'Information', 'custom-html-block-extension' ) }
				onClick={ () => setIsModalOpen( true ) }
			></Button>
		</PanelRow>
	);
};

export default Rulers;
