/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { info } from '@wordpress/icons';
import { Button, Guide } from '@wordpress/components';

export default function WelcomeGuide() {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	useEffect( () => {
		if ( ! window.chbeObj.dismissWelcomeGuide ) {
			setIsModalOpen( true );
		}
	}, [] );

	const onFinish = () => {
		if ( ! window.chbeObj.dismissWelcomeGuide ) {
			apiFetch( {
				path: '/custom-html-block-extension/v1/dismiss_welcome_guide',
				method: 'POST',
			} ).then( () => {
				setIsModalOpen( false );
			} );
		} else {
			setIsModalOpen( false );
		}
	};

	return (
		<>
			<Button
				className="chbe-admin-welcome-guide-toggle"
				variant="tertiary"
				// TODO: Remove this prop and add size="small" prop when
				// the supported minimum WordPress version is 6.3 or higher.
				// See: https://github.com/WordPress/gutenberg/pull/51842
				isSmall
				icon={ info }
				iconSize="18"
				onClick={ () => setIsModalOpen( true ) }
			>
				{ __( 'About this plugin', 'custom-html-block-extension' ) }
			</Button>
			{ isModalOpen && (
				<Guide
					onFinish={ onFinish }
					className="chbe-admin-welcome-guide-modal"
					contentLabel={ __( 'About Custom HTML Block Extension', 'custom-html-block-extension' ) }
					finishButtonText={ __( 'Get started', 'custom-html-block-extension' ) }
					pages={ [
						{
							image: (
								<img
									src={
										window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_1.gif'
									}
									alt={ __( 'About Custom HTML Block Extension', 'custom-html-block-extension' ) }
								/>
							),
							content: (
								<>
									<h1>
										{ __( 'About Custom HTML Block Extension', 'custom-html-block-extension' ) }
									</h1>
									<p>
										{ sprintf(
											/* translators: %s is replaced with the number. */
											__( 'Version: %s', 'custom-html-block-extension' ),
											window.chbeObj.version
										) }
									</p>
									<p>
										{ __(
											'Custom HTML Block Extension extends Custom HTML block to evolve into the advanced code editor.',
											'custom-html-block-extension'
										) }
									</p>
								</>
							),
						},
						{
							image: (
								<img
									src={
										window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_2.gif'
									}
									alt={ __( 'Various color themes', 'custom-html-block-extension' ) }
								/>
							),
							content: (
								<>
									<h1>{ __( 'Various color themes', 'custom-html-block-extension' ) }</h1>
									<p>
										{ __(
											'There are 50 different color themes to choose from, and you can select the one that best suits your taste.',
											'custom-html-block-extension'
										) }
									</p>
								</>
							),
						},
						{
							image: (
								<img
									src={
										window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_3.gif'
									}
									alt={ __( 'Faster coding with Emmet', 'custom-html-block-extension' ) }
								/>
							),
							content: (
								<>
									<h1>{ __( 'Faster coding with Emmet', 'custom-html-block-extension' ) }</h1>
									<p>
										{ __(
											'Emmet allows you to type shortcuts that are then expanded into full pieces of code. Type less, saving both keystrokes.',
											'custom-html-block-extension'
										) }
									</p>
								</>
							),
						},
						{
							image: (
								<img
									src={
										window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_4.jpg'
									}
									alt={ __( 'High customizability', 'custom-html-block-extension' ) }
								/>
							),
							content: (
								<>
									<h1>{ __( 'High customizability', 'custom-html-block-extension' ) }</h1>
									<p>
										{ __(
											'You can change all kinds of settings to create your ideal editor in advanced mode.',
											'custom-html-block-extension'
										) }
									</p>
								</>
							),
						},
						{
							image: (
								<img
									src={
										window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_5.jpg'
									}
									alt={ __( 'More support', 'custom-html-block-extension' ) }
								/>
							),
							content: (
								<>
									<h1>{ __( 'More support', 'custom-html-block-extension' ) }</h1>
									<p>
										{ __(
											'Supports the classic editor, the theme/plugin editor, import/export editor settings, and change indentation.',
											'custom-html-block-extension'
										) }
									</p>
								</>
							),
						},
					] }
				/>
			) }
		</>
	);
}
