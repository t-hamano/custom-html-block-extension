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
	Modal
} from '@wordpress/components';

const MatchBrackets = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			matchBrackets: value
		});
	};

	return (
		<PanelRow>
			<SelectControl
				label={ __( 'Highlight matching brackets', 'custom-html-block-extension' ) }
				value={ editorOptions.matchBrackets }
				options={ [
					{ label: __( 'Always', 'custom-html-block-extension' ), value: 'always' },
					{ label: __( 'Never', 'custom-html-block-extension' ), value: 'never' },
					{ label: __( 'Only when the cursor is near the bracket', 'custom-html-block-extension' ), value: 'near' }
				] }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Highlight matching brackets', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<div className="chbe-modal__row">
						<div className="chbe-modal__col">
							<h3>{ __( 'Always (default)', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'always' === editorOptions.matchBrackets }
								isTertiary={ 'always' !== editorOptions.matchBrackets }
								onClick={ () => {
									handleChange( 'always' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/match-brackets_1.gif' }
									alt={ __( 'Always (default)', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Never', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'never' === editorOptions.matchBrackets }
								isTertiary={ 'never' !== editorOptions.matchBrackets }
								onClick={ () => {
									handleChange( 'never' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/match-brackets_2.gif' }
									alt={ __( 'Never', 'custom-html-block-extension' ) }
								/>
							</Button>
						</div>
						<div className="chbe-modal__col">
							<h3>{ __( 'Only when the cursor is near the bracket', 'custom-html-block-extension' ) }</h3>
							<Button
								isPrimary={ 'near' === editorOptions.matchBrackets }
								isTertiary={ 'near' !== editorOptions.matchBrackets }
								onClick={ () => {
									handleChange( 'near' );
									setIsModalOpen( false );
								}}
							>
								<img
									src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/match-brackets_3.gif' }
									alt={ __( 'Only when the cursor is near the bracket', 'custom-html-block-extension' ) }
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

export default MatchBrackets;
