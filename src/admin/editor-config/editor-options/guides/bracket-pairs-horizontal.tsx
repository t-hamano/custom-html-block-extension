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

type Value = EditorOptions[ 'guides' ][ 'bracketPairsHorizontal' ];

export default function GuidesBracketPairsHorizontal() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Bracket Pairs Horizontal', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Guides', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const items: { label: string; value: Value; image: string; isDefault?: boolean }[] = [
		{
			label: __( 'All bracket pairs', 'custom-html-block-extension' ),
			value: true,
			image: 'editor-options/guides/bracket-pairs-horizontal_1.jpg',
		},
		{
			label: __( 'Only the active bracket pair', 'custom-html-block-extension' ),
			value: 'active',
			image: 'editor-options/guides/bracket-pairs-horizontal_2.jpg',
			isDefault: true,
		},
		{
			label: __( 'None', 'custom-html-block-extension' ),
			value: false,
			image: 'editor-options/guides/bracket-pairs-horizontal_3.jpg',
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
				bracketPairsHorizontal: value,
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
						( item ) => item.value === String( editorOptions.guides.bracketPairsHorizontal )
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
							'Add horizontal lines to the guides shown by Bracket Pairs, pointing to the brackets that are not at the start of a line. Has no effect when Bracket Pairs is set to None.',
							'custom-html-block-extension'
						) }
					</Text>
				}
				items={ items }
				colCount="3"
				value={ editorOptions.guides.bracketPairsHorizontal }
			/>
		</Stack>
	);
}
