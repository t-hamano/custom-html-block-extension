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
			setting={ {
				control: 'toggle',
				label: __( 'Non Basic ASCII', 'custom-html-block-extension' ),
				group: __( 'Unicode Highlight', 'custom-html-block-extension' ),
				value: editorOptions.unicodeHighlight.nonBasicASCII,
				onChange,
				defaultValue: false,
				help: {
					description: __(
						'Controls whether all non-basic ASCII characters are highlighted. Only characters between U+0020 and U+007E, tab, line-feed and carriage-return are considered basic ASCII.',
						'custom-html-block-extension'
					),
					image: 'editor-options/unicode-highlight/non-basic-ascii.jpg',
				},
			} }
		/>
	);
}
