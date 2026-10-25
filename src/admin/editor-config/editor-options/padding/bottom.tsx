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

export default function PaddingBottom() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			padding: {
				...editorOptions.padding,
				bottom: value ? toNumber( value, 0, 50 ) : 0,
			},
		} );
	};

	return (
		<SettingItem
			control="range"
			name="padding.bottom"
			label={ __( 'Bottom (px)', 'custom-html-block-extension' ) }
			value={ editorOptions.padding.bottom }
			onChange={ onChange }
			min={ 0 }
			max={ 50 }
			defaultValue={ 0 }
			help={ {
				description: __(
					'Controls the amount of space between the bottom edge of the editor and the last line.',
					'custom-html-block-extension'
				),
				image: 'editor-options/padding/bottom.gif',
			} }
		/>
	);
}
