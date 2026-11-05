/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { Dialog, Link, Stack, Text } from '@wordpress/ui';

type KeyboardShortcutsModalProps = {
	onClose: () => void;
};

export default function KeyboardShortcutsModal( { onClose }: KeyboardShortcutsModalProps ) {
	// Focus the dialog itself on open instead of the link inside it.
	const popupRef = useRef< HTMLDivElement >( null );

	return (
		<Dialog.Root open onOpenChange={ onClose }>
			<Dialog.Popup
				ref={ popupRef }
				className="chbe-admin-keyboard-shortcuts-modal"
				initialFocus={ popupRef }
			>
				<Dialog.Header>
					<Dialog.Title>{ __( 'About shortcut', 'custom-html-block-extension' ) }</Dialog.Title>
					<Dialog.CloseIconButton />
				</Dialog.Header>
				<Dialog.Content>
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
				</Dialog.Content>
			</Dialog.Popup>
		</Dialog.Root>
	);
}
