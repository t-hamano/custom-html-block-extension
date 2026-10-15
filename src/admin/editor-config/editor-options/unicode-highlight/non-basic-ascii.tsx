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

export default function UnicodeHighlightNonBasicAscii() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight non-ASCII characters', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SwitchControl
				label={ title }
				checked={ editorOptions.unicodeHighlight.nonBasicASCII }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'All characters other than basic ASCII characters are surrounded by a border. This also includes letters of languages such as Japanese and accented letters.',
					'custom-html-block-extension'
				) }
				isToggle
				image="editor-options/unicode-highlight/non-basic-ascii.jpg"
				value={ editorOptions.unicodeHighlight.nonBasicASCII }
			/>
		</Stack>
	);
}
