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

const QuickSuggestions = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			quickSuggestions: value,
			suggestOnTriggerCharacters: value
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Enable suggest', 'custom-html-block-extension' ) }
				checked={ editorOptions.quickSuggestions }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Suggest', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Get suggestions as you type codes. Accepting suggestions will autocomplete code and help faster coding.', 'custom-html-block-extension' ) }</p>
					<p>{ __( 'Defaults to enable.', 'custom-html-block-extension' ) }</p>
					<img
						src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/quick-suggestions.gif' }
						alt={ __( 'Suggest', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.quickSuggestions }
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

export default QuickSuggestions;
