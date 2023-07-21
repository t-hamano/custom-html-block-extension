/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function AutoClosingBrackets() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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
			autoClosingBrackets: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Auto closing brackets', 'custom-html-block-extension' ) }
				value={ editorOptions.autoClosingBrackets }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Auto closing brackets', 'custom-html-block-extension' ) }
				items={ items }
				colCount="3"
				value={ editorOptions.autoClosingBrackets }
			/>
		</div>
	);
}
