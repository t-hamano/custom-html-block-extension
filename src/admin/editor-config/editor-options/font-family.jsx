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
	SelectControl,
	Button,
	ExternalLink,
	Modal
} from '@wordpress/components';

const FontFamily = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			fontFamily: value
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Font family', 'custom-html-block-extension' ) }
				value={ editorOptions.fontFamily }
				options={ chbeObj.fontFamily.map( ({ label, name }) => ({ label: label, value: name }) ) }
				onChange={ ( value ) => handleChange( value ) }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Add custom fonts', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'You can use your own favorite fonts in addition to the default fonts. Please refer to the following document for instructions on how to add custom fonts.', 'custom-html-block-extension' ) }</p>
					<p><ExternalLink href={ __( 'https://github.com/t-hamano/custom-html-block-extension#add-custom-fonts', 'custom-html-block-extension' ) }>{ __( 'GitHub Project Page', 'custom-html-block-extension' ) }</ExternalLink></p>
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

export default FontFamily;
