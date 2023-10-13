/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import ItemHelp from '../../components/item-help';
import { toNumber } from '../../../../lib/helper';

export default function MinimapMaxColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Width', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

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
				label={ title }
				value={ editorOptions.minimap.maxColumn }
				min="10"
				max="60"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp title={ title } image={ 'editor-options/minimap/max-column.gif' } />
		</div>
	);
}
