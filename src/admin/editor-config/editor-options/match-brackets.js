/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import ItemHelp from '../components/item-help';

export default function MatchBrackets() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			matchBrackets: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Highlight matching brackets', 'custom-html-block-extension' ) }
				value={ editorOptions.matchBrackets }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Cursor animation style', 'custom-html-block-extension' ) }
				items={ items }
				colCount="3"
				value={ editorOptions.matchBrackets }
			/>
		</div>
	);
}
