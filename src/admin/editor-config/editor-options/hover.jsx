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

const Hover = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			hover: value
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Enable hover hints', 'custom-html-block-extension' ) }
				checked={ editorOptions.hover }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Enable hover hints', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Defaults to enable.', 'custom-html-block-extension' ) }</p>
					<img
						src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/hover.gif' }
						alt={ __( 'Enable hover hints', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.hover }
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

export default Hover;
