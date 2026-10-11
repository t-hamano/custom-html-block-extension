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

export default function ShowFoldingControls() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Show code folding icon', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always show', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_1.jpg',
			value: 'always',
		},
		{
			label: __( 'Show on mouseover', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_2.gif',
			value: 'mouseover',
			isDefault: true,
		},
		{
			label: __( 'Never show', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_3.gif',
			value: 'never',
		},
	];

	const onChange = ( value: EditorOptions[ 'showFoldingControls' ] ) => {
		setEditorOptions( {
			...editorOptions,
			showFoldingControls: value,
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
				value={ items.find( ( item ) => item.value === editorOptions.showFoldingControls ) ?? null }
				onValueChange={ ( item ) =>
					item && onChange( item.value as EditorOptions[ 'showFoldingControls' ] )
				}
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.showFoldingControls }
			/>
		</Stack>
	);
}
