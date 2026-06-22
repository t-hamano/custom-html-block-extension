/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';
import { toNumber } from '../../../../lib/helper';

export default function MinimapMaxColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Width', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				maxColumn: value ? toNumber( value, 10, 60 ) : 60,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.minimap.maxColumn }
					min={ 10 }
					max={ 60 }
					allowReset
					onChange={ onChange }
				/>
				<ItemHelp title={ title } image="editor-options/minimap/max-column.gif" />
			</HStack>
		</div>
	);
}
