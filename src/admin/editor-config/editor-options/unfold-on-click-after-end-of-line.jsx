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

const UnfoldOnClickAfterEndOfLine = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			unfoldOnClickAfterEndOfLine: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __(
					'Expand folding line when clicking on empty content after a folded line',
					'custom-html-block-extension'
				) }
				checked={ editorOptions.unfoldOnClickAfterEndOfLine }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __(
						'Expand folding line when clicking on empty content after a folded line',
						'custom-html-block-extension'
					) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Defaults to disable.', 'custom-html-block-extension' ) }</p>
					<img
						src={
							chbeObj.pluginUrl +
							'/assets/images/admin/editor-config/editor-options/unfold-on-click-after-end-of-line.gif'
						}
						alt={ __(
							'Expand folding line when clicking on empty content after a folded line',
							'custom-html-block-extension'
						) }
					/>
					<ToggleControl
						checked={ editorOptions.unfoldOnClickAfterEndOfLine }
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

export default UnfoldOnClickAfterEndOfLine;
