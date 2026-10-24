/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function UnicodeHighlightAmbiguousCharacters() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			unicodeHighlight: {
				...editorOptions.unicodeHighlight,
				ambiguousCharacters: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="unicodeHighlight.ambiguousCharacters"
			label={ __( 'Ambiguous Characters', 'custom-html-block-extension' ) }
			value={ editorOptions.unicodeHighlight.ambiguousCharacters }
			onChange={ onChange }
			defaultValue
			help={ {
				description: (
					<Text render={ <p /> }>
						{ createInterpolateElement(
							__(
								"Characters that look like common ASCII characters, such as the curly quote <code>‘</code> that looks like the straight quote <code>'</code>, are surrounded by a border.",
								'custom-html-block-extension'
							),
							{
								code: <code />,
							}
						) }
					</Text>
				),
				image: 'editor-options/unicode-highlight/ambiguous-characters.jpg',
			} }
		/>
	);
}
