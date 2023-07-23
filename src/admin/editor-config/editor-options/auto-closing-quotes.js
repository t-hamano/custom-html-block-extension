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
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function AutoClosingQuotes() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Auto closing quotes', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
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
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingQuotes: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ title }
				value={ editorOptions.autoClosingQuotes }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				colCount="3"
				value={ editorOptions.autoClosingQuotes }
			/>
		</div>
	);
}
