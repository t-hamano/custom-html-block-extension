/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { info } from '@wordpress/icons';
import { isAppleOS } from '@wordpress/keycodes';
import { Button, Modal } from '@wordpress/components';
import { Link, Stack, Text } from '@wordpress/ui';

export default function Shortcut() {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	return (
		<>
			<Button
				variant="tertiary"
				size="small"
				icon={ info }
				iconSize={ 16 }
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
					<Stack direction="column" gap="lg">
						<Text render={ <p /> }>
							{ __(
								'This plugin is made with "Monaco Editor", the code editor behind VS Code.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ __(
								'So you can use many of keyboard shortcuts available in VS Code on custom HTML block.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							<Link
								href={
									isAppleOS()
										? __(
												'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf',
												'custom-html-block-extension'
										  )
										: __(
												'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf',
												'custom-html-block-extension'
										  )
								}
								openInNewTab
							>
								{ isAppleOS()
									? __( 'Keyboard shortcuts for macOS', 'custom-html-block-extension' )
									: __( 'Keyboard shortcuts for Windows', 'custom-html-block-extension' ) }
							</Link>
						</Text>
					</Stack>
				</Modal>
			) }
		</>
	);
}
