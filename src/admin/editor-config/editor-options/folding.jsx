/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import {
	PanelRow,
	ToggleControl,
	Button,
	Modal
} from '@wordpress/components';

const Folding = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			folding: value
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Enable code folding', 'custom-html-block-extension' ) }
				checked={ editorOptions.folding }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Code folding', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'You can fold regions of source code using the folding icons between line numbers and line start. Move the mouse over the folding icon and click to fold and unfold regions. Use Shift + Click on the folding icon to fold or unfold the region and all regions inside.', 'custom-html-block-extension' ) }</p>
					<p>{ __( 'Defaults to enable.', 'custom-html-block-extension' ) }</p>
					<img
						src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/folding.gif' }
						alt={ __( 'Code folding', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.folding }
						onChange={ ( value ) => {
							handleChange( value );
							setIsModalOpen( false );
						}}
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

export default Folding;
