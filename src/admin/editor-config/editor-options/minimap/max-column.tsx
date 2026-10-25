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

export default function MinimapMaxColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			minimap: {
				...editorOptions.minimap,
				maxColumn: value ? toNumber( value, 10, 200 ) : 120,
			},
		} );
	};

	return (
		<SettingItem
			control="range"
			name="minimap.maxColumn"
			label={ __( 'Max Column', 'custom-html-block-extension' ) }
			value={ editorOptions.minimap.maxColumn }
			onChange={ onChange }
			min={ 10 }
			max={ 200 }
			defaultValue={ 120 }
			help={ {
				description: __(
					'Limit the width of the minimap to render at most a certain number of columns.',
					'custom-html-block-extension'
				),
				image: 'editor-options/minimap/max-column.gif',
			} }
		/>
	);
}
