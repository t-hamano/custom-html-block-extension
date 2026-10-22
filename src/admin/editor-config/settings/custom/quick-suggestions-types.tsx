/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { SelectControl, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import ItemHelp from '../../components/item-help';

type TokenType = keyof EditorOptions[ 'quickSuggestions' ];
type Value = EditorOptions[ 'quickSuggestions' ][ TokenType ];

/**
 * Labels of the token types, also used as the search text of the setting.
 */
export function getTokenTypes(): { label: string; value: TokenType }[] {
	return [
		{ label: __( 'Quick Suggestions (Other)', 'custom-html-block-extension' ), value: 'other' },
		{
			label: __( 'Quick Suggestions (Comments)', 'custom-html-block-extension' ),
			value: 'comments',
		},
		{ label: __( 'Quick Suggestions (Strings)', 'custom-html-block-extension' ), value: 'strings' },
	];
}

export default function QuickSuggestionsTypes( { label }: { label: string } ) {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const tokenTypes = getTokenTypes();

	// monaco also allows `'offWhenInlineCompletions'`, but the plugin registers
	// no inline completion provider, so it would behave the same as `'on'`.
	const items = [
		{
			label: __( 'Show in the suggestion list', 'custom-html-block-extension' ),
			value: 'on',
			image: 'editor-options/quick-suggestions-types_1.gif',
			description: __(
				'Suggestions automatically appear in the suggestion list while typing.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Show as ghost text', 'custom-html-block-extension' ),
			value: 'inline',
			image: 'editor-options/quick-suggestions-types_2.gif',
			description: __(
				'Suggestions automatically appear as inline ghost text while typing.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/quick-suggestions-types_3.gif',
			description: sprintf(
				/* translators: %s: The keyboard shortcut to show suggestions. */
				__(
					'Suggestions appear only after typing a trigger character such as "<", or pressing %s.',
					'custom-html-block-extension'
				),
				isAppleOS()
					? __( 'Control+Space', 'custom-html-block-extension' )
					: __( 'Ctrl+Space', 'custom-html-block-extension' )
			),
		},
	];

	const selectItems = items.map( ( item ) => ( { label: item.label, value: item.value } ) );

	const onChange = ( tokenType: TokenType, value: Value ) => {
		setEditorOptions( ( current ) => ( {
			...current,
			quickSuggestions: {
				...current.quickSuggestions,
				[ tokenType ]: value,
			},
		} ) );
	};

	const { other, comments, strings } = editorOptions.quickSuggestions;
	const allValue = other === comments && other === strings ? other : undefined;

	const onChangeAll = ( value: Value ) => {
		setEditorOptions( ( current ) => ( {
			...current,
			quickSuggestions: {
				other: value,
				comments: value,
				strings: value,
			},
		} ) );
	};

	return (
		<>
			<Stack direction="column" align="start" gap="sm">
				{ tokenTypes.map( ( tokenType ) => (
					<SelectControl
						key={ tokenType.value }
						label={ tokenType.label }
						items={ selectItems }
						value={
							selectItems.find(
								( item ) => item.value === editorOptions.quickSuggestions[ tokenType.value ]
							) ?? null
						}
						onValueChange={ ( item ) => item && onChange( tokenType.value, item.value as Value ) }
					/>
				) ) }
			</Stack>
			<ItemHelp
				title={ label }
				description={ __(
					'Controls whether suggestions should automatically show up while typing. This can be controlled for typing in comments, strings, and other code.',
					'custom-html-block-extension'
				) }
				items={ items }
				colCount="3"
				value={ allValue }
				onChange={ onChangeAll }
			/>
		</>
	);
}
