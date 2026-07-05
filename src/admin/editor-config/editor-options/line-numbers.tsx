/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function LineNumbers() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Show line numbers', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Hide', 'custom-html-block-extension' ),
			value: 'off',
			image: 'editor-options/line-numbers_1.jpg',
		},
		{
			label: __( 'Show', 'custom-html-block-extension' ),
			value: 'on',
			image: 'editor-options/line-numbers_2.jpg',
			isDefault: true,
		},
		{
			label: __( 'Show number of lines to cursor position', 'custom-html-block-extension' ),
			value: 'relative',
			image: 'editor-options/line-numbers_3.gif',
		},
		{
			label: __( 'Show every 10 lines', 'custom-html-block-extension' ),
			value: 'interval',
			image: 'editor-options/line-numbers_4.gif',
		},
	] as const;

	const onChange = ( value: EditorOptions[ 'lineNumbers' ] ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbers: value,
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
			<SelectControl< EditorOptions[ 'lineNumbers' ] >
				__next40pxDefaultSize
				label={ title }
				value={ editorOptions.lineNumbers }
				options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="4"
				value={ editorOptions.lineNumbers }
			/>
		</Stack>
	);
}
