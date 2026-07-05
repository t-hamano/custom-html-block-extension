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

export default function FoldingStrategy() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Folding range strategy', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Depends on documentation', 'custom-html-block-extension' ),
			value: 'auto',
			image: 'editor-options/folding-strategy_1.gif',
			description: __(
				'This is effective for folding code that is not indented correctly.',
				'custom-html-block-extension'
			),
			isDefault: true,
		},
		{
			label: __( 'Depends on indentation', 'custom-html-block-extension' ),
			value: 'indentation',
			image: 'editor-options/folding-strategy_2.gif',
		},
	] as const;

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
			<SelectControl< EditorOptions[ 'foldingStrategy' ] >
				__next40pxDefaultSize
				label={ title }
				value={ editorOptions.foldingStrategy }
				options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.foldingStrategy }
			/>
		</Stack>
	);
}
