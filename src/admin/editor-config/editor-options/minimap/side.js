/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { BaseControl, ButtonGroup, Button } from '@wordpress/components';
import ItemHelp from '../../components/item-help';

export default function MinimapSide() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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
				<BaseControl.VisualLabel>
					{ __( 'Position', 'custom-html-block-extension' ) }
				</BaseControl.VisualLabel>
				<ButtonGroup aria-label={ __( 'Position', 'custom-html-block-extension' ) }>
					{ items.map( ( item, index ) => (
						<Button
							key={ index }
							variant={ editorOptions.minimap.side === item.value ? 'primary' : undefined }
							onClick={ () => onChange( item.value ) }
						>
							{ item.label }
						</Button>
					) ) }
				</ButtonGroup>
			</BaseControl>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Position', 'custom-html-block-extension' ) }
				items={ items }
				value={ editorOptions.minimap.side }
			/>
		</div>
	);
}
