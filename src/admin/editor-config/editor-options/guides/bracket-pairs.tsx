/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

type Value = EditorOptions[ 'guides' ][ 'bracketPairs' ];

export default function GuidesBracketPairs() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Guides: Bracket Pairs', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items: { label: string; value: Value; image: string; isDefault?: boolean }[] = [
		{
			label: __( 'All bracket pairs', 'custom-html-block-extension' ),
			value: true,
			image: 'editor-options/guides/bracket-pairs_1.jpg',
		},
		{
			label: __( 'Only the active bracket pair', 'custom-html-block-extension' ),
			value: 'active',
			image: 'editor-options/guides/bracket-pairs_2.jpg',
		},
		{
			label: __( 'None', 'custom-html-block-extension' ),
			value: false,
			image: 'editor-options/guides/bracket-pairs_3.jpg',
			isDefault: true,
		},
	];

	// SelectControl only accepts string values, so convert booleans to strings.
	const selectItems = items.map( ( item ) => ( {
		label: item.label,
		value: String( item.value ),
	} ) );

	const onChange = ( value: Value ) => {
		setEditorOptions( {
			...editorOptions,
			guides: {
				...editorOptions.guides,
				bracketPairs: value,
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
			<SelectControl
				label={ title }
				items={ selectItems }
				value={
					selectItems.find(
						( item ) => item.value === String( editorOptions.guides.bracketPairs )
					) ?? null
				}
				onValueChange={ ( selectItem ) => {
					const item = items.find( ( { value } ) => String( value ) === selectItem?.value );
					if ( item ) {
						onChange( item.value );
					}
				} }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
					<Text render={ <p /> }>
						{ __(
							'Draw vertical lines between matching brackets, so you can see which code is inside each pair.',
							'custom-html-block-extension'
						) }
					</Text>
				}
				items={ items }
				colCount="3"
				value={ editorOptions.guides.bracketPairs }
			/>
		</Stack>
	);
}
