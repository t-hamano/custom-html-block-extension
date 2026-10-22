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

	const title = __( 'Show Folding Controls', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always show', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_1.jpg',
			description: __( 'Always show the folding controls.', 'custom-html-block-extension' ),
			value: 'always',
		},
		{
			label: __( 'Show on mouseover', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_2.gif',
			description: __(
				'Only show the folding controls when the mouse is over the gutter.',
				'custom-html-block-extension'
			),
			value: 'mouseover',
			isDefault: true,
		},
		{
			label: __( 'Never show', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_3.gif',
			description: __(
				'Never show the folding controls and reduce the gutter size.',
				'custom-html-block-extension'
			),
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
				description={ __(
					'Controls when the folding controls on the gutter are shown.',
					'custom-html-block-extension'
				) }
				items={ items }
				colCount="3"
				value={ editorOptions.showFoldingControls }
			/>
		</Stack>
	);
}
