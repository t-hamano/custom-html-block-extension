/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import {
	ExternalLink,
	Notice,
	ToggleControl,
	__experimentalText as Text,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function Emmet() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Enable Emmet', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorSettings( {
			...editorSettings,
			emmet: value,
		} );
	};

	return (
		<HStack justify="start" align="start" wrap>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ title }
				checked={ editorSettings.emmet }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
					<>
						<Text as="p">
							{ __(
								'Emmet is a function for the editor that allow for high-speed coding via content assist.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text as="p">
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
						<Text as="p">
							<ExternalLink href="https://docs.emmet.io/cheat-sheet/">
								{ __( 'Check cheat sheet', 'custom-html-block-extension' ) }
							</ExternalLink>
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
		</HStack>
	);
}
