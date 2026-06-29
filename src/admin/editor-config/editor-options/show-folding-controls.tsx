/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { SelectControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function ShowFoldingControls() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Show code folding icon', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const items = [
		{
			label: __( 'Always show', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_1.jpg',
			value: 'always',
		},
		{
			label: __( 'Show on mouseover', 'custom-html-block-extension' ),
			image: 'editor-options/show-folding-controls_2.gif',
			value: 'mouseover',
			isDefault: true,
		},
	] as const;

	const onChange = ( value: EditorOptions[ 'showFoldingControls' ] ) => {
		setEditorOptions( {
			...editorOptions,
			showFoldingControls: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<SelectControl< EditorOptions[ 'showFoldingControls' ] >
					__next40pxDefaultSize
					label={ title }
					value={ editorOptions.showFoldingControls }
					options={ items.map( ( { label, value } ) => ( { label, value } ) ) }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					items={ items }
					value={ editorOptions.showFoldingControls }
				/>
			</HStack>
		</div>
	);
}
