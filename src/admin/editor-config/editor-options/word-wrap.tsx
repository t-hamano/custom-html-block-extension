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

export default function WordWrap() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Word Wrap', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Off', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/word-wrap_1.gif',
			description: __( 'Lines will never wrap.', 'custom-html-block-extension' ),
			isDefault: true,
		},
		{
			label: __( 'On', 'custom-html-block-extension' ),
			value: 'on',
			image: 'editor-options/word-wrap_2.gif',
			description: __( 'Lines will wrap at the viewport width.', 'custom-html-block-extension' ),
		},
		{
			label: __( 'Depends on word wrap column', 'custom-html-block-extension' ),
			value: 'wordWrapColumn',
			image: 'editor-options/word-wrap_3.gif',
			description: __( 'Lines will wrap at "Word Wrap Column".', 'custom-html-block-extension' ),
		},
		{
			label: __( 'Flexible', 'custom-html-block-extension' ),
			value: 'bounded',
			image: 'editor-options/word-wrap_4.gif',
			description: __(
				'Lines will wrap at the minimum of viewport and "Word Wrap Column".',
				'custom-html-block-extension'
			),
		},
	];

	const selectItems = items.map( ( { label, value } ) => ( { label, value } ) );

	const onChange = ( value: EditorOptions[ 'wordWrap' ] ) => {
		setEditorOptions( {
			...editorOptions,
			wordWrap: value,
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
				value={ selectItems.find( ( item ) => item.value === editorOptions.wordWrap ) ?? null }
				onValueChange={ ( item ) => item && onChange( item.value as EditorOptions[ 'wordWrap' ] ) }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.wordWrap }
			/>
		</Stack>
	);
}
