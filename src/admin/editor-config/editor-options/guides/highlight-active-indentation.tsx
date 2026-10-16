/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

type Value = EditorOptions[ 'guides' ][ 'highlightActiveIndentation' ];

export default function GuidesHighlightActiveIndentation() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Guides: Highlight Active Indentation', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items: {
		label: string;
		value: Value;
		image: string;
		isDefault?: boolean;
		description?: string;
	}[] = [
		{
			label: __( 'Enable', 'custom-html-block-extension' ),
			value: true,
			image: 'editor-options/guides/highlight-active-indentation_1.gif',
			isDefault: true,
			description: __( 'Highlights the active indent guide.', 'custom-html-block-extension' ),
		},
		{
			label: __( 'Always', 'custom-html-block-extension' ),
			value: 'always',
			image: 'editor-options/guides/highlight-active-indentation_2.gif',
			description: __(
				'Highlights the active indent guide even if bracket guides are highlighted.',
				'custom-html-block-extension'
			),
		},
		{
			label: __( 'Disable', 'custom-html-block-extension' ),
			value: false,
			image: 'editor-options/guides/highlight-active-indentation_3.gif',
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
				highlightActiveIndentation: value,
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
						( item ) => item.value === String( editorOptions.guides.highlightActiveIndentation )
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
				items={ items }
				colCount="3"
				value={ editorOptions.guides.highlightActiveIndentation }
			/>
		</Stack>
	);
}
