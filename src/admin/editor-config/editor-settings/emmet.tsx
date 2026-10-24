/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { Link } from '@wordpress/ui';

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
			name="emmet"
			label={ __( 'Enable Emmet', 'custom-html-block-extension' ) }
			value={ editorSettings.emmet }
			onChange={ onChange }
			defaultValue
			help={ {
				description: createInterpolateElement(
					__(
						'Emmet is a function for the editor that allows for high-speed coding via content assist. In the block and classic editor, it is only valid for HTML tags and does not support inline CSS. In the theme/plugin editor, it is available if the file extension is html, php, sass, scss, css, or less. Select text and run "Emmet: Wrap with Abbreviation" from the context menu or the command palette (<code>F1</code>) to wrap it with an abbreviation. In the theme/plugin editor, this is available if the file extension is html or php. <a>Check cheat sheet</a>',
						'custom-html-block-extension'
					),
					{
						code: <code />,
						a: <Link href="https://docs.emmet.io/cheat-sheet/" openInNewTab />,
					}
				),
				image: 'editor-settings/emmet.gif',
			} }
		/>
	);
}
