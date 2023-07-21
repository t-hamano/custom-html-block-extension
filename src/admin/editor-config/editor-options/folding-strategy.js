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

export default function FoldingStrategy() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			foldingStrategy: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __( 'Folding range strategy', 'custom-html-block-extension' ) }
				value={ editorOptions.foldingStrategy }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Folding range strategy', 'custom-html-block-extension' ) }
				items={ items }
				value={ editorOptions.foldingStrategy }
			/>
		</div>
	);
}
