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

export default function UnicodeHighlightInvisibleCharacters() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Invisible Characters', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SwitchControl
				label={ title }
				checked={ editorOptions.unicodeHighlight.invisibleCharacters }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether characters that just reserve space or have no width at all are highlighted.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle
				image="editor-options/unicode-highlight/invisible-characters.jpg"
				value={ editorOptions.unicodeHighlight.invisibleCharacters }
			/>
		</Stack>
	);
}
