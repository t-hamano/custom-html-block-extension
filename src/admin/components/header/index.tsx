/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { help } from '@wordpress/icons';
import { DropdownMenu, Icon, __experimentalHeading as Heading } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

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
				<Heading as="h1">
					<Stack justify="center" gap="sm">
						<Icon icon={ BlockIcon } size={ 32 } />
						<span>{ __( 'Custom HTML Block Extension', 'custom-html-block-extension' ) }</span>
					</Stack>
				</Heading>
				<DropdownMenu
					className="chbe-admin-header__info"
					icon={ help }
					label={ __( 'Help', 'custom-html-block-extension' ) }
					text={ __( 'Help', 'custom-html-block-extension' ) }
					toggleProps={ {
						variant: 'tertiary',
						showTooltip: false,
						size: 'compact',
					} }
					controls={ [
						{
							title: __( 'Welcome guide', 'custom-html-block-extension' ),
							onClick: () => setOpenModal( 'welcome-guide' ),
						},
						{
							title: __( 'Keyboard shortcuts', 'custom-html-block-extension' ),
							onClick: () => setOpenModal( 'keyboard-shortcuts' ),
						},
					] }
				/>
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
