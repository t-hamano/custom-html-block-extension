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

export default function PaddingTop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			padding: {
				...editorOptions.padding,
				top: value ? toNumber( value, 0, 50 ) : 0,
			},
		} );
	};

	return (
		<SettingItem
			control="range"
			name="padding.top"
			label={ __( 'Top (px)', 'custom-html-block-extension' ) }
			value={ editorOptions.padding.top }
			onChange={ onChange }
			min={ 0 }
			max={ 50 }
			defaultValue={ 0 }
			help={ {
				description: __(
					'Controls the amount of space between the top edge of the editor and the first line.',
					'custom-html-block-extension'
				),
				image: 'editor-options/padding/top.gif',
			} }
		/>
	);
}
