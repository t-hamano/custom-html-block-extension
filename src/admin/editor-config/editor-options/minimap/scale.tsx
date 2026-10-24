/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { toNumber } from '../../../../lib/helper';
import SettingItem from '../../components/setting-item';

export default function MinimapScale() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				scale: value ? toNumber( value, 1, 3 ) : 1,
			},
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Scale', 'custom-html-block-extension' ) }
			value={ editorOptions.minimap.scale }
			onChange={ onChange }
			min={ 1 }
			max={ 3 }
			defaultValue={ 1 }
			help={ {
				description: __( 'Scale of content drawn in the minimap.', 'custom-html-block-extension' ),
				image: 'editor-options/minimap/scale.gif',
			} }
		/>
	);
}
