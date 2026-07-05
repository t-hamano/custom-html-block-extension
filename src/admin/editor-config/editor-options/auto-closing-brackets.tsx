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

export default function AutoClosingBrackets() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Auto closing brackets', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always', 'custom-html-block-extension' ),
			value: 'always',
			image: 'editor-options/auto-closing-brackets_1.gif',
		},
		{
			label: __(
				'Only when there is whitespace right after the cursor',
				'custom-html-block-extension'
			),
			value: 'beforeWhitespace',
			isDefault: true,
			image: 'editor-options/auto-closing-brackets_2.gif',
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/auto-closing-brackets_3.gif',
		},
	] as const;

	const onChange = ( value: EditorOptions[ 'autoClosingBrackets' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingBrackets: value,
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
			<SelectControl< EditorOptions[ 'autoClosingBrackets' ] >
				__next40pxDefaultSize
				label={ title }
				value={ editorOptions.autoClosingBrackets }
				options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.autoClosingBrackets }
			/>
		</Stack>
	);
}
