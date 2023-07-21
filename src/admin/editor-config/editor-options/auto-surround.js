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

export default function AutoSurround() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const items = [
		{
			label: __( 'Quotes and brackets', 'custom-html-block-extension' ),
			value: 'languageDefined',
			isDefault: true,
			image: 'editor-options/auto-surround_1.gif',
		},
		{
			label: __( 'Quotes only', 'custom-html-block-extension' ),
			value: 'quotes',
			image: 'editor-options/auto-surround_2.gif',
		},
		{
			label: __( 'Brackets only', 'custom-html-block-extension' ),
			value: 'brackets',
			image: 'editor-options/auto-surround_3.gif',
		},
		{
			label: __( 'Never', 'custom-html-block-extension' ),
			value: 'never',
			image: 'editor-options/auto-surround_4.gif',
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			autoSurround: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<SelectControl
				label={ __(
					'Automatically surround selection with quotes or brackets',
					'custom-html-block-extension'
				) }
				value={ editorOptions.autoSurround }
				options={ items.map( ( { label, value } ) => {
					return { label, value };
				} ) }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __(
					'Automatically surround selection with quotes or brackets',
					'custom-html-block-extension'
				) }
				items={ items }
				value={ editorOptions.autoSurround }
			/>
		</div>
	);
}
