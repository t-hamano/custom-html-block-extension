/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { toNumber } from '../../../lib/helper';
import SettingItem from '../components/setting-item';

export default function LineHeight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			lineHeight: value === undefined ? 21 : toNumber( value, 0, 60 ),
		} );
	};

	return (
		<SettingItem
			control="range"
			name="lineHeight"
			label={ __( 'Line Height', 'custom-html-block-extension' ) }
			value={ editorOptions.lineHeight }
			onChange={ onChange }
			min={ 0 }
			max={ 60 }
			step={ 0.1 }
			defaultValue={ 21 }
			help={ {
				description: __(
					'0 computes the line height from the font size. Values less than 8 are a multiplier of the font size. Values of 8 or more are pixels.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
