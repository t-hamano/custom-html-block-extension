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

export default function MinimapScale() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Scale', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

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
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" align="start" wrap>
				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ title }
					value={ editorOptions.minimap.scale }
					min={ 1 }
					max={ 3 }
					allowReset
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					image="editor-options/minimap/scale.gif"
					value={ editorOptions.minimap.scale }
				/>
			</HStack>
		</div>
	);
}
