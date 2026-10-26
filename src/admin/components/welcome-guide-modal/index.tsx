/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Guide } from '@wordpress/components';
import { Stack, Text } from '@wordpress/ui';

type WelcomeGuideModalProps = {
	onClose: () => void;
};

export default function WelcomeGuideModal( { onClose }: WelcomeGuideModalProps ) {
	return (
		<Guide
			onFinish={ onClose }
			className="chbe-admin-welcome-guide-modal"
			contentLabel={ __( 'About Custom HTML Block Extension', 'custom-html-block-extension' ) }
			finishButtonText={ __( 'Get started', 'custom-html-block-extension' ) }
			pages={ [
				{
					image: (
						<img
							src={ window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_1.gif' }
							alt={ __( 'About Custom HTML Block Extension', 'custom-html-block-extension' ) }
						/>
					),
					content: (
						<Stack className="chbe-admin-welcome-guide-modal__content" direction="column" gap="lg">
							<Text variant="heading-xl" render={ <h1 /> }>
								{ __( 'About Custom HTML Block Extension', 'custom-html-block-extension' ) }
							</Text>
							<Text render={ <p /> }>
								{ sprintf(
									/* translators: %s is replaced with the number. */
									__( 'Version: %s', 'custom-html-block-extension' ),
									window.chbeObj.version
								) }
							</Text>
							<Text render={ <p /> }>
								{ __(
									'Custom HTML Block Extension turns the Custom HTML block into an advanced code editor powered by Monaco Editor, the code editor behind VS Code.',
									'custom-html-block-extension'
								) }
							</Text>
						</Stack>
					),
				},
				{
					image: (
						<img
							src={ window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_2.gif' }
							alt={ __( 'Syntax highlighting with 50 themes', 'custom-html-block-extension' ) }
						/>
					),
					content: (
						<Stack className="chbe-admin-welcome-guide-modal__content" direction="column" gap="lg">
							<Text variant="heading-xl" render={ <h1 /> }>
								{ __( 'Syntax highlighting with 50 themes', 'custom-html-block-extension' ) }
							</Text>
							<Text render={ <p /> }>
								{ __(
									'Choose from 50 color themes to suit your taste. Block delimiters and shortcodes are highlighted, too.',
									'custom-html-block-extension'
								) }
							</Text>
						</Stack>
					),
				},
				{
					image: (
						<img
							src={ window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_3.gif' }
							alt={ __( 'Faster coding with Emmet', 'custom-html-block-extension' ) }
						/>
					),
					content: (
						<Stack className="chbe-admin-welcome-guide-modal__content" direction="column" gap="lg">
							<Text variant="heading-xl" render={ <h1 /> }>
								{ __( 'Faster coding with Emmet', 'custom-html-block-extension' ) }
							</Text>
							<Text render={ <p /> }>
								{ __(
									'Type short abbreviations and Emmet expands them into full pieces of code. You can also wrap selected code with an abbreviation.',
									'custom-html-block-extension'
								) }
							</Text>
						</Stack>
					),
				},
				{
					image: (
						<img
							src={ window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_4.jpg' }
							alt={ __( 'High customizability', 'custom-html-block-extension' ) }
						/>
					),
					content: (
						<Stack className="chbe-admin-welcome-guide-modal__content" direction="column" gap="lg">
							<Text variant="heading-xl" render={ <h1 /> }>
								{ __( 'High customizability', 'custom-html-block-extension' ) }
							</Text>
							<Text render={ <p /> }>
								{ __(
									'Fine-tune the look and behavior of the editor to make it your own. You can also import your settings from VS Code, and export them back.',
									'custom-html-block-extension'
								) }
							</Text>
						</Stack>
					),
				},
				{
					image: (
						<img
							src={ window.chbeObj.pluginUrl + '/assets/images/admin/welcome-guide/slide_5.gif' }
							alt={ __( 'Works everywhere', 'custom-html-block-extension' ) }
						/>
					),
					content: (
						<Stack className="chbe-admin-welcome-guide-modal__content" direction="column" gap="lg">
							<Text variant="heading-xl" render={ <h1 /> }>
								{ __( 'Works everywhere', 'custom-html-block-extension' ) }
							</Text>
							<Text render={ <p /> }>
								{ __(
									'The same editor is also available in the code editor of the post and site editors, the classic editor, and the theme and plugin file editors.',
									'custom-html-block-extension'
								) }
							</Text>
						</Stack>
					),
				},
			] }
		/>
	);
}
