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

const CopyWithSyntaxHighlighting = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			copyWithSyntaxHighlighting: value
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Copy with syntax highlighting', 'custom-html-block-extension' ) }
				checked={ editorOptions.copyWithSyntaxHighlighting }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Copy with syntax highlighting', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Example: How it looks when pasted into Microsoft Word', 'custom-html-block-extension' ) }</p>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Enable (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ editorOptions.copyWithSyntaxHighlighting }
								isTertiary={ ! editorOptions.copyWithSyntaxHighlighting }
								onClick={ () => {
									handleChange( true );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/copy-with-syntax-highlighting_1.jpg' }
									alt={ __( 'Enable (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Disable', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ ! editorOptions.copyWithSyntaxHighlighting }
								isTertiary={ editorOptions.copyWithSyntaxHighlighting }
								onClick={ () => {
									handleChange( false );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/copy-with-syntax-highlighting_2.jpg' }
									alt={ __( 'Disable', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
					</div>
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

export default CopyWithSyntaxHighlighting;
