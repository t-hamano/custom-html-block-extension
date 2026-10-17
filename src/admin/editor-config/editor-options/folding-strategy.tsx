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

export default function FoldingStrategy() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Folding Strategy', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Depends on the language', 'custom-html-block-extension' ),
			value: 'auto',
			image: 'editor-options/folding-strategy_1.gif',
			description: __(
				'Use a language-specific folding strategy if available, else the indentation-based one.',
				'custom-html-block-extension'
			),
			isDefault: true,
		},
		{
			label: __( 'Depends on indentation', 'custom-html-block-extension' ),
			value: 'indentation',
			image: 'editor-options/folding-strategy_2.gif',
			description: __(
				'Use the indentation-based folding strategy.',
				'custom-html-block-extension'
			),
		},
	];

	const selectItems = items.map( ( { label, value } ) => ( { label, value } ) );

	const onChange = ( value: EditorOptions[ 'foldingStrategy' ] ) => {
		setEditorOptions( {
			...editorOptions,
			foldingStrategy: value,
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
					selectItems.find( ( item ) => item.value === editorOptions.foldingStrategy ) ?? null
				}
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'foldingStrategy' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls the strategy for computing folding ranges.',
					'custom-html-block-extension'
				) }
				items={ items }
				value={ editorOptions.foldingStrategy }
			/>
		</Stack>
	);
}
