/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { info } from '@wordpress/icons';
import {
	Button,
	Guide,
	__experimentalText as Text,
	__experimentalHeading as Heading,
	__experimentalSpacer as Spacer,
	__experimentalVStack as VStack,
} from '@wordpress/components';

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
				variant="tertiary"
				size="small"
				icon={ info }
				iconSize="16"
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
								<Spacer paddingX={ 8 } paddingY={ 4 } marginBottom={ 0 }>
									<VStack spacing={ 4 }>
										<Heading level="2" as="h1">
											{ __( 'About Custom HTML Block Extension', 'custom-html-block-extension' ) }
										</Heading>
										<Text as="p">
											{ sprintf(
												/* translators: %s is replaced with the number. */
												__( 'Version: %s', 'custom-html-block-extension' ),
												window.chbeObj.version
											) }
										</Text>
										<Text as="p">
											{ __(
												'Custom HTML Block Extension extends Custom HTML block to evolve into the advanced code editor.',
												'custom-html-block-extension'
											) }
										</Text>
									</VStack>
								</Spacer>
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
								<Spacer paddingX={ 8 } paddingY={ 4 } marginBottom={ 0 }>
									<VStack spacing={ 4 }>
										<Heading level="2" as="h1">
											{ __( 'Various color themes', 'custom-html-block-extension' ) }
										</Heading>
										<Text as="p">
											{ __(
												'There are 50 different color themes to choose from, and you can select the one that best suits your taste.',
												'custom-html-block-extension'
											) }
										</Text>
									</VStack>
								</Spacer>
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
								<Spacer paddingX={ 8 } paddingY={ 4 } marginBottom={ 0 }>
									<VStack spacing={ 4 }>
										<Heading level="2" as="h1">
											{ __( 'Faster coding with Emmet', 'custom-html-block-extension' ) }
										</Heading>
										<Text as="p">
											{ __(
												'Emmet allows you to type shortcuts that are then expanded into full pieces of code. Type less, saving both keystrokes.',
												'custom-html-block-extension'
											) }
										</Text>
									</VStack>
								</Spacer>
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
								<Spacer paddingX={ 8 } paddingY={ 4 } marginBottom={ 0 }>
									<VStack spacing={ 4 }>
										<Heading level="2" as="h1">
											{ __( 'High customizability', 'custom-html-block-extension' ) }
										</Heading>
										<Text as="p">
											{ __(
												'You can change all kinds of settings to create your ideal editor in advanced mode.',
												'custom-html-block-extension'
											) }
										</Text>
									</VStack>
								</Spacer>
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
								<Spacer paddingX={ 8 } paddingY={ 4 } marginBottom={ 0 }>
									<VStack spacing={ 4 }>
										<Heading level="2" as="h1">
											{ __( 'More support', 'custom-html-block-extension' ) }
										</Heading>
										<Text as="p">
											{ __(
												'Supports the classic editor, the theme/plugin editor, import/export editor settings, and change indentation.',
												'custom-html-block-extension'
											) }
										</Text>
									</VStack>
								</Spacer>
							),
						},
					] }
				/>
			) }
		</>
	);
}
