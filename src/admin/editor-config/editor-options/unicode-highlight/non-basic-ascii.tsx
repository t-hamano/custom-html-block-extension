/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function UnicodeHighlightNonBasicAscii() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			unicodeHighlight: {
				...editorOptions.unicodeHighlight,
				nonBasicASCII: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="unicodeHighlight.nonBasicASCII"
			label={ __( 'Non Basic ASCII', 'custom-html-block-extension' ) }
			value={ editorOptions.unicodeHighlight.nonBasicASCII }
			onChange={ onChange }
			defaultValue={ false }
			help={ {
				description: createInterpolateElement(
					__(
						'Controls whether all non-basic ASCII characters are highlighted. Only characters between <code>U+0020</code> and <code>U+007E</code>, tab, line-feed and carriage-return are considered basic ASCII.',
						'custom-html-block-extension'
					),
					{
						code: <code />,
					}
				),
				image: 'editor-options/unicode-highlight/non-basic-ascii.jpg',
			} }
		/>
	);
}
