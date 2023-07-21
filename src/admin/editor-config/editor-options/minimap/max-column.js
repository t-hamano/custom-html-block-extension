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

export default function MinimapMaxColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				maxColumn: value ? toNumber( value, 10, 60 ) : 60,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Width', 'custom-html-block-extension' ) }
				value={ editorOptions.minimap.maxColumn }
				min="10"
				max="60"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				title={ __( 'Width', 'custom-html-block-extension' ) }
				image={ 'editor-options/minimap/max-column.gif' }
			/>
		</div>
	);
}
