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
			description: __( 'Always autoclose quotes.', 'custom-html-block-extension' ),
		},
		{
			label: __( 'Determined by the language', 'custom-html-block-extension' ),
			value: 'languageDefined',
			image: 'editor-options/auto-closing-quotes_2.gif',
			description: __(
				'Use language configurations to determine when to autoclose quotes.',
				'custom-html-block-extension'
			),
		},
		{
			label: __(
				'Only when there is whitespace right after the cursor',
				'custom-html-block-extension'
			),
			value: 'beforeWhitespace',
			image: 'editor-options/auto-closing-quotes_3.gif',
			description: __(
				'Autoclose quotes only when the cursor is to the left of whitespace.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/auto-closing-quotes_4.gif',
			description: __( 'Never autoclose quotes.', 'custom-html-block-extension' ),
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
				description={ __(
					'Controls whether the editor should automatically close quotes after the user adds an opening quote.',
					'custom-html-block-extension'
				) }
				items={ items }
				colCount="2"
				value={ editorOptions.autoClosingQuotes }
			/>
		</Stack>
	);
}
