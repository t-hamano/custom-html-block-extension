/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { info } from '@wordpress/icons';
import {
	Button,
	ExternalLink,
	Modal,
	__experimentalText as Text,
	__experimentalVStack as VStack,
} from '@wordpress/components';

export default function Shortcut() {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<>
			<Button
				variant="tertiary"
				size="small"
				icon={ info }
				iconSize="16"
				onClick={ () => setIsModalOpen( true ) }
			>
				{ __( 'About shortcut', 'custom-html-block-extension' ) }
			</Button>
			{ isModalOpen && (
				<Modal
					className="chbe-admin-shortcut-modal"
					title={ __( 'About shortcut', 'custom-html-block-extension' ) }
					onRequestClose={ () => setIsModalOpen( false ) }
				>
					<VStack spacing={ 4 }>
						<Text as="p">
							{ __(
								'This plugin is made with "Monaco Editor", the code editor behind VS Code.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text as="p">
							{ __(
								'So you can use many of keyboard shortcuts available in VS Code on custom HTML block.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text as="p">
							{ __(
								'Check the following link for a list of shortcuts.',
								'custom-html-block-extension'
							) }
						</Text>
						<ul>
							<li>
								<ExternalLink
									href={ __(
										'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf',
										'custom-html-block-extension'
									) }
								>
									{ __( 'Keyboard shortcuts for Windows', 'custom-html-block-extension' ) }
								</ExternalLink>
							</li>
							<li>
								<ExternalLink
									href={ __(
										'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf',
										'custom-html-block-extension'
									) }
								>
									{ __( 'Keyboard shortcuts for macOS', 'custom-html-block-extension' ) }
								</ExternalLink>
							</li>
						</ul>
					</VStack>
				</Modal>
			) }
		</>
	);
}
