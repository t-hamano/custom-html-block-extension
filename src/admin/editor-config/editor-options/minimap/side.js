/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import { BaseControl, ButtonGroup, Button } from '@wordpress/components';
import ItemHelp from '../../components/item-help';

export default function MinimapSide() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Position', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const items = [
		{
			label: __( 'Left', 'custom-html-block-extension' ),
			image: 'editor-options/minimap/side_1.jpg',
			value: 'left',
		},
		{
			label: __( 'Right', 'custom-html-block-extension' ),
			image: 'editor-options/minimap/side_2.jpg',
			value: 'right',
			isDefault: true,
		},
	];

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				side: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<BaseControl>
				<BaseControl.VisualLabel>{ title }</BaseControl.VisualLabel>
				<ButtonGroup aria-label={ title }>
					{ items.map( ( item, index ) => (
						<Button
							key={ index }
							variant={ editorOptions.minimap.side === item.value ? 'primary' : undefined }
							onClick={ () => onChange( item.value ) }
							size="compact"
						>
							{ item.label }
						</Button>
					) ) }
				</ButtonGroup>
			</BaseControl>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ items }
				value={ editorOptions.minimap.side }
			/>
		</div>
	);
}
