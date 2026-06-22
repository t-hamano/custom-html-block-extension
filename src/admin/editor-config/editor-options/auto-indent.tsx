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
import { EditorConfigContext, useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function AutoIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Auto indent', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'None', 'custom-html-block-extension' ),
			value: 'none',
			image: 'editor-options/auto-indent_1.gif',
		},
		{
			label: __( 'Keep', 'custom-html-block-extension' ),
			value: 'keep',
			image: 'editor-options/auto-indent_2.gif',
		},
		{
			label: __( 'Advanced', 'custom-html-block-extension' ),
			value: 'advanced',
			isDefault: true,
			image: 'editor-options/auto-indent_3.gif',
		},
	];

	const onChange = ( value: string ) => {
		setEditorOptions( {
			...editorOptions,
			autoIndent: value,
		} );
		onRefreshEditor();
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.autoIndent }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					colCount="3"
					value={ editorOptions.autoIndent }
				/>
			</HStack>
		</div>
	);
}
