/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { isAppleOS } from '@wordpress/keycodes';
import { Modal } from '@wordpress/components';
import { Link, Stack, Text } from '@wordpress/ui';

type KeyboardShortcutsModalProps = {
	onClose: () => void;
};

export default function KeyboardShortcutsModal( { onClose }: KeyboardShortcutsModalProps ) {
	return (
		<Modal
			className="chbe-admin-keyboard-shortcuts-modal"
			title={ __( 'About shortcut', 'custom-html-block-extension' ) }
			onRequestClose={ onClose }
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
	);
}
