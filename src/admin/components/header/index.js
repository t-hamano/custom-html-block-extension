/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Icon,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

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
				<Heading as="h1" justify="center">
					<HStack justify="center">
						<Icon icon={ BlockIcon } size={ 32 } />
						<span>{ __( 'Custom HTML Block Extension', 'custom-html-block-extension' ) }</span>
					</HStack>
				</Heading>
				<VStack className="chbe-admin-header__info">
					<WelcomeGuide />
					<Shortcut />
				</VStack>
			</div>
		</header>
	);
}
