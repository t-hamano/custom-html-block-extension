/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { SelectControl, Stack, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function AcceptSuggestionOnEnter() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Accept suggestions on enter key', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Enable', 'custom-html-block-extension' ),
			value: 'on',
			isDefault: true,
		},
		{
			label: __( 'Only when it makes a text change', 'custom-html-block-extension' ),
			value: 'smart',
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: 'off',
		},
	];

	const onChange = ( value: EditorOptions[ 'acceptSuggestionOnEnter' ] ) => {
		setEditorOptions( {
			...editorOptions,
			acceptSuggestionOnEnter: value,
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
				value={
					items.find( ( item ) => item.value === editorOptions.acceptSuggestionOnEnter ) ?? null
				}
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'acceptSuggestionOnEnter' ] )
				}
			/>
			<ItemHelp
				title={ title }
				description={
					<>
						<Text render={ <p /> }>
							{ createInterpolateElement(
								__(
									'Accept suggestions on <code>Enter</code> key in addition to <code>Tab</code> key.',
									'custom-html-block-extension'
								),
								{
									code: <code />,
								}
							) }
						</Text>
						<Text render={ <p /> }>
							{ __(
								'If "Only when it makes a text change" is selected, the suggestion is accepted only when it changes the text. For example, if the suggestion is the same as the word already typed, pressing Enter inserts a new line instead.',
								'custom-html-block-extension'
							) }
						</Text>
					</>
				}
			/>
		</Stack>
	);
}
