/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { help } from '@wordpress/icons';
import { Button, Icon, Menu, Stack, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import BlockIcon from '../../../components/block-icon';
import WelcomeGuideModal from '../welcome-guide-modal';
import KeyboardShortcutsModal from '../keyboard-shortcuts-modal';

type ModalName = 'welcome-guide' | 'keyboard-shortcuts';

export default function Header() {
	const [ openModal, setOpenModal ] = useState< ModalName | null >(
		window.chbeObj.dismissWelcomeGuide ? null : 'welcome-guide'
	);

	return (
		<header className="chbe-admin-header">
			<div className="chbe-admin-container">
				<Text variant="heading-2xl" render={ <h1 /> }>
					<Stack justify="center" align="center" gap="sm">
						<Icon icon={ BlockIcon } size={ 32 } />
						<span>{ __( 'Custom HTML Block Extension', 'custom-html-block-extension' ) }</span>
					</Stack>
				</Text>
				<Menu.Root>
					<Menu.Trigger
						className="chbe-admin-header__info"
						render={ <Button variant="minimal" size="compact" /> }
					>
						<Button.Icon icon={ help } />
						{ __( 'Help', 'custom-html-block-extension' ) }
					</Menu.Trigger>
					<Menu.Popup>
						<Menu.Item onClick={ () => setOpenModal( 'welcome-guide' ) }>
							<Menu.ItemLabel>
								{ __( 'Welcome guide', 'custom-html-block-extension' ) }
							</Menu.ItemLabel>
						</Menu.Item>
						<Menu.Item onClick={ () => setOpenModal( 'keyboard-shortcuts' ) }>
							<Menu.ItemLabel>
								{ __( 'Keyboard shortcuts', 'custom-html-block-extension' ) }
							</Menu.ItemLabel>
						</Menu.Item>
					</Menu.Popup>
				</Menu.Root>
				{ openModal === 'welcome-guide' && (
					<WelcomeGuideModal onClose={ () => setOpenModal( null ) } />
				) }
				{ openModal === 'keyboard-shortcuts' && (
					<KeyboardShortcutsModal onClose={ () => setOpenModal( null ) } />
				) }
			</div>
		</header>
	);
}
