/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { Link, Notice, Stack, SwitchControl, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function Emmet() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const title = __( 'Enable Emmet', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorSettings( {
			...editorSettings,
			emmet: value,
		} );
	};

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SwitchControl
				label={ title }
				checked={ editorSettings.emmet }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
					<>
						<Text render={ <p /> }>
							{ __(
								'Emmet is a function for the editor that allow for high-speed coding via content assist.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ __(
								'Only valid for HTML tags and does not support inline CSS in the block and classic editor.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ __(
								'You can use Emmet if the file extension is html, php, sass, scss, css, or less in the theme/plugin editor.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ createInterpolateElement(
								__(
									'Select text and run "Emmet: Wrap with Abbreviation" from the context menu or the command palette (<code>F1</code>) to wrap it with an abbreviation.',
									'custom-html-block-extension'
								),
								{
									code: <code />,
								}
							) }
						</Text>
						<Text render={ <p /> }>
							{ __(
								'In the theme/plugin editor, this is available if the file extension is html or php.',
								'custom-html-block-extension'
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
				}
				isToggle
				defaultToggle
				image="editor-settings/emmet.gif"
				value={ editorSettings.emmet }
			/>
		</Stack>
	);
}
