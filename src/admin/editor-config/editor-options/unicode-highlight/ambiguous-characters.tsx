/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function UnicodeHighlightAmbiguousCharacters() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight ambiguous characters', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SwitchControl
				label={ title }
				checked={ editorOptions.unicodeHighlight.ambiguousCharacters }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Characters that look like common ASCII characters, such as the curly quote "‘" that looks like the straight quote "\'", are surrounded by a border. They often get mixed in when copying code from a web page, and an attribute quoted with them does not get the intended value.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image="editor-options/unicode-highlight/ambiguous-characters.jpg"
				value={ editorOptions.unicodeHighlight.ambiguousCharacters }
			/>
		</Stack>
	);
}
