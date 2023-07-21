/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';
import { toNumber } from 'lib/helper';

export default function MinimapScale() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				scale: value ? toNumber( value, 1, 3 ) : 1,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Scale', 'custom-html-block-extension' ) }
				value={ editorOptions.minimap.scale }
				min="1"
				max="3"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Scale', 'custom-html-block-extension' ) }
				image={ 'editor-options/minimap/scale.gif' }
				value={ editorOptions.minimap.scale }
			/>
		</div>
	);
}
