/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
				<h1 className="chbe-admin-header__title">
					{ BlockIcon }
					{ __( 'Custom HTML Block Extension', 'custom-html-block-extension' ) }
				</h1>
				<ul className="chbe-admin-header__info">
					<li className="chbe-admin-header__info-item">
						<WelcomeGuide />
					</li>
					<li className="chbe-admin-header__info-item">
						<Shortcut />
					</li>
				</ul>
			</div>
		</header>
	);
}
