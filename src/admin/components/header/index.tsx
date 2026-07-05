/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, __experimentalHeading as Heading } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import BlockIcon from '../../../components/block-icon';
import WelcomeGuide from '../welcome-guide';
import Shortcut from '../shortcut';

export default function Header() {
	return (
		<header className="chbe-admin-header">
			<div className="chbe-admin-container">
				<Heading as="h1">
					<Stack justify="center" gap="sm">
						<Icon icon={ BlockIcon } size={ 32 } />
						<span>{ __( 'Custom HTML Block Extension', 'custom-html-block-extension' ) }</span>
					</Stack>
				</Heading>
				<Stack direction="column" className="chbe-admin-header__info" gap="sm">
					<WelcomeGuide />
					<Shortcut />
				</Stack>
			</div>
		</header>
	);
}
