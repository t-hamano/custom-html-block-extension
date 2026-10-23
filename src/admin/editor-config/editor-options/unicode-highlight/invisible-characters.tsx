/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function UnicodeHighlightInvisibleCharacters() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			unicodeHighlight: {
				...editorOptions.unicodeHighlight,
				invisibleCharacters: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Invisible Characters', 'custom-html-block-extension' ) }
			group="unicodeHighlight"
			value={ editorOptions.unicodeHighlight.invisibleCharacters }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __(
					'Controls whether characters that just reserve space or have no width at all are highlighted.',
					'custom-html-block-extension'
				),
				image: 'editor-options/unicode-highlight/invisible-characters.jpg',
			} }
		/>
	);
}
