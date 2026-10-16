/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function AutoClosingQuotes() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Auto Closing Quotes', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always', 'custom-html-block-extension' ),
			value: 'always',
			isDefault: true,
			image: 'editor-options/auto-closing-quotes_1.gif',
		},
		{
			label: __( 'Determined by the language', 'custom-html-block-extension' ),
			value: 'languageDefined',
			image: 'editor-options/auto-closing-quotes_2.gif',
		},
		{
			label: __(
				'Only when there is whitespace right after the cursor',
				'custom-html-block-extension'
			),
			value: 'beforeWhitespace',
			image: 'editor-options/auto-closing-quotes_3.gif',
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/auto-closing-quotes_4.gif',
		},
	];

	const onChange = ( value: EditorOptions[ 'autoClosingQuotes' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingQuotes: value,
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
			<SelectControl
				label={ title }
				items={ items }
				value={ items.find( ( item ) => item.value === editorOptions.autoClosingQuotes ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'autoClosingQuotes' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="2"
				value={ editorOptions.autoClosingQuotes }
			/>
		</Stack>
	);
}
