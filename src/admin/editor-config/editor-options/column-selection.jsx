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

const ColumnSelection = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			columnSelection: value,
		} );
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Enable column selection', 'custom-html-block-extension' ) }
				checked={ editorOptions.columnSelection }
				onChange={ handleChange }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Enable column selection', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>
						{ __(
							'Always enable column selection. Following command can be used to select column selection even when disabled.',
							'custom-html-block-extension'
						) }
					</p>
					<dl>
						<dt>{ __( 'Windows:', 'custom-html-block-extension' ) }</dt>
						<dd>
							{ __(
								'"Shift + Alt + drag mouse", or "Ctrl + Shift + Alt + arrow key"',
								'custom-html-block-extension'
							) }
						</dd>
						<dt>{ __( 'macOS:', 'custom-html-block-extension' ) }</dt>
						<dd>
							{ __(
								'"Shift + Option + drag mouse", or "Shift + Option + Command + arrow key"',
								'custom-html-block-extension'
							) }
						</dd>
					</dl>
					<p>{ __( 'Defaults to disable.', 'custom-html-block-extension' ) }</p>
					<img
						src={
							chbeObj.pluginUrl +
							'/assets/images/admin/editor-config/editor-options/column-selection.gif'
						}
						alt={ __( 'Column selection', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.columnSelection }
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

export default ColumnSelection;
