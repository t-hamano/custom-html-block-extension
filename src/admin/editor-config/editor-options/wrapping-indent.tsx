/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function WrappingIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Word wrap indent', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'None', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_1.jpg',
			value: 'none',
			isDefault: true,
		},
		{
			label: __( 'Same', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_2.jpg',
			value: 'same',
		},
		{
			label: __( 'Indent', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_3.jpg',
			value: 'indent',
		},
		{
			label: __( 'Deep indent', 'custom-html-block-extension' ),
			image: 'editor-options/wrapping-indent_4.jpg',
			value: 'deepIndent',
		},
	];

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			wrappingIndent: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.wrappingIndent }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					value={ editorOptions.wrappingIndent }
				/>
			</HStack>
		</div>
	);
}
