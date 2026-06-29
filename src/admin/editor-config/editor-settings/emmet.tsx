/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Notice, ToggleControl } from '@wordpress/components';
import { Link, Stack, Text } from '@wordpress/ui';

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
		<div className="chbe-admin-editor-config__setting-item">
			<Stack justify="start" align="start" wrap="wrap" gap="sm">
				<ToggleControl label={ title } checked={ editorSettings.emmet } onChange={ onChange } />
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
								<br />
								{ __(
									'You can use Emmet if the file extension is html, php, sass, scss, css, or less in the theme/plugin editor.',
									'custom-html-block-extension'
								) }
							</Text>
							<Text render={ <p /> }>
								<Link href="https://docs.emmet.io/cheat-sheet/" openInNewTab>
									{ __( 'Check cheat sheet', 'custom-html-block-extension' ) }
								</Link>
							</Text>
							<Notice status="warning" isDismissible={ false }>
								{ __(
									'Save and reload the browser to reflect this settings in the preview editor area.',
									'custom-html-block-extension'
								) }
							</Notice>
						</>
					}
					isToggle
					defaultToggle
					image="editor-settings/emmet.gif"
					value={ editorSettings.emmet }
				/>
			</Stack>
		</div>
	);
}
