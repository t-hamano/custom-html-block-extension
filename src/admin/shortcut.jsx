/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import {
	Button,
	ExternalLink,
	Modal
} from '@wordpress/components';

const Shortcut = () => {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<div className="chbe-shortcut">
			<Button
				isTertiary
				isSmall
				icon={ info }
				iconSize ="18"
				onClick={ () => setIsModalOpen( true ) }
			>
				{ __( 'About shortcut', 'custom-html-block-extension' ) }
			</Button>
			{ isModalOpen && (
				<Modal
					title={ __( 'About shortcut', 'custom-html-block-extension' ) }
					className="chbe-modal"
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<p>{ __( 'This plugin is made with "Monaco Editor", the code editor behind VS Code.', 'custom-html-block-extension' ) }</p>
					<p>{ __( 'So you can use many of keyboard shortcuts available in VS Code on custom HTML block.', 'custom-html-block-extension' ) }</p>
					<p>{ __( 'Check the following link for a list of shortcuts.', 'custom-html-block-extension' ) }</p>
					<ul>
						<li><ExternalLink href={ __( 'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf', 'custom-html-block-extension' ) }>{ __( 'Keyboard shortcuts for Windows', 'custom-html-block-extension' ) }</ExternalLink></li>
						<li><ExternalLink href={ __( 'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf', 'custom-html-block-extension' ) }>{ __( 'Keyboard shortcuts for macOS', 'custom-html-block-extension' ) }</ExternalLink></li>
					</ul>
				</Modal>
			)}
		</div>
	);
};

export default Shortcut;
