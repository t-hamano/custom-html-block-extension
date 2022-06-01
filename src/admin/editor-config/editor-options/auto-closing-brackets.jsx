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

import { PanelRow, SelectControl, Button, Modal } from '@wordpress/components';

const AutoClosingBrackets = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingBrackets: value,
		} );
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Auto closing brackets', 'custom-html-block-extension' ) }
				value={ editorOptions.autoClosingBrackets }
				options={ [
					{ label: __( 'Always', 'custom-html-block-extension' ), value: 'always' },
					{
						label: __(
							'Only when there is whitespace right after the cursor',
							'custom-html-block-extension'
						),
						value: 'beforeWhitespace',
					},
					{ label: __( 'Never', 'custom-html-block-extension' ), value: 'never' },
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Auto closing brackets', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Always (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'always' === editorOptions.autoClosingBrackets }
								isTertiary={ 'always' !== editorOptions.autoClosingBrackets }
								onClick={ () => {
									handleChange( 'always' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/auto-closing-brackets_1.gif'
									}
									alt={ __( 'Always (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>
								{ __(
									'Only when there is whitespace right after the cursor',
									'custom-html-block-extension'
								) }
							</h3>
							<Button
								isPrimary={ 'beforeWhitespace' === editorOptions.autoClosingBrackets }
								isTertiary={ 'beforeWhitespace' !== editorOptions.autoClosingBrackets }
								onClick={ () => {
									handleChange( 'beforeWhitespace' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/auto-closing-brackets_2.gif'
									}
									alt={ __(
										'Only when there is whitespace right after the cursor',
										'custom-html-block-extension'
									) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Never', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'never' === editorOptions.autoClosingBrackets }
								isTertiary={ 'never' !== editorOptions.autoClosingBrackets }
								onClick={ () => {
									handleChange( 'never' );
									setIsModalOpen( false );
								} }
							>
								<img
									src={
										chbeObj.pluginUrl +
										'/assets/images/admin/editor-config/editor-options/auto-closing-brackets_3.gif'
									}
									alt={ __( 'Never', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
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

export default AutoClosingBrackets;
