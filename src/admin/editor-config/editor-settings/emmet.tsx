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
						'Type an abbreviation to expand it into HTML or CSS code. In the block and classic editors, only HTML is supported. Select text and run "Emmet: Wrap with Abbreviation" (<code>F1</code>) to wrap it with an abbreviation. <a>Check cheat sheet</a>',
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
