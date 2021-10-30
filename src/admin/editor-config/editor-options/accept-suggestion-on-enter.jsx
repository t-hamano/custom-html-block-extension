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

import { PanelRow, ToggleControl, Button, Modal } from '@wordpress/components';

const AcceptSuggestionOnEnter = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			acceptSuggestionOnEnter: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Accept suggestions on enter key', 'custom-html-block-extension' ) }
				checked={ editorOptions.acceptSuggestionOnEnter }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Accept suggestions on enter key', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Accept suggestions on enter key in addition to tab key.',
							'custom-html-block-extension'
						) }
					</p>
					<p>{ __( 'Defaults to enable.', 'custom-html-block-extension' ) }</p>
					<ToggleControl
						checked={ editorOptions.acceptSuggestionOnEnter }
						onChange={ ( value ) => {
							handleChange( value );
							setIsModalOpen( false );
						} }
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

export default AcceptSuggestionOnEnter;
