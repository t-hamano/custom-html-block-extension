/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { Link, Notice, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function Emmet() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorSettings( {
			...editorSettings,
			emmet: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Enable Emmet', 'custom-html-block-extension' ) }
			value={ editorSettings.emmet }
			onChange={ onChange }
			defaultValue
			help={ {
				description: (
					<>
						<Text render={ <p /> }>
							{ __(
								'Emmet is a function for the editor that allows for high-speed coding via content assist. In the block and classic editor, it is only valid for HTML tags and does not support inline CSS. In the theme/plugin editor, it is available if the file extension is html, php, sass, scss, css, or less.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ createInterpolateElement(
								__(
									'Select text and run "Emmet: Wrap with Abbreviation" from the context menu or the command palette (<code>F1</code>) to wrap it with an abbreviation. In the theme/plugin editor, this is available if the file extension is html or php.',
									'custom-html-block-extension'
								),
								{
									code: <code />,
								}
							) }
						</Text>
						<Text render={ <p /> }>
							<Link href="https://docs.emmet.io/cheat-sheet/" openInNewTab>
								{ __( 'Check cheat sheet', 'custom-html-block-extension' ) }
							</Link>
						</Text>
						<Notice.Root intent="warning">
							<Notice.Description>
								{ __(
									'Save and reload the browser to reflect this settings in the preview editor area.',
									'custom-html-block-extension'
								) }
							</Notice.Description>
						</Notice.Root>
					</>
				),
				image: 'editor-settings/emmet.gif',
			} }
		/>
	);
}
