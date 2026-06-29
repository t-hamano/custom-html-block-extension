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

export default function MatchBrackets() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight matching brackets', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always', 'custom-html-block-extension' ),
			value: 'always',
			isDefault: true,
			image: 'editor-options/match-brackets_1.gif',
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/match-brackets_2.gif',
		},
		{
			label: __( 'Only when the cursor is near the bracket', 'custom-html-block-extension' ),
			value: 'near',
			image: 'editor-options/match-brackets_3.gif',
		},
	] as const;

	const onChange = ( value: EditorOptions[ 'matchBrackets' ] ) => {
		setEditorOptions( {
			...editorOptions,
			matchBrackets: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<Stack justify="start" align="start" wrap="wrap" gap="sm">
				<SelectControl< EditorOptions[ 'matchBrackets' ] >
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.matchBrackets }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					colCount="3"
					value={ editorOptions.matchBrackets }
				/>
			</Stack>
		</div>
	);
}
