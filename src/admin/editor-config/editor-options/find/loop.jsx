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

const Loop = () => {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleChange = ( value ) => {
		setEditorOptions({
			...editorOptions,
			find: {
				...editorOptions.find,
				loop: value
			}
		});
	};

	return (
		<PanelRow>
			<ToggleControl
				label={ __( 'Loop', 'custom-html-block-extension' ) }
				checked={ editorOptions.find.loop }
				onChange={ ( value ) => handleChange( value ) }
			/>
			{ isModalOpen && (
				<Modal
					title={ __( 'Loop', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'Automatically restart the search from the beginning (or end) when no more matches are found.', 'custom-html-block-extension' ) }</p>
					<p>{ __( 'Defaults to enable.', 'custom-html-block-extension' ) }</p>
					<img
						src={ chbeObj.assetPath + '/assets/images/admin/editor-config/editor-options/find/loop.gif' }
						alt={ __( 'Automatically restart the search from the beginning (or end) when no more matches are found.', 'custom-html-block-extension' ) }
					/>
					<ToggleControl
						checked={ editorOptions.find.loop }
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

export default Loop;
