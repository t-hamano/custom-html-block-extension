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

const DEFAULT_DELAY = 300;

export default function HoverDelay() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			hover: {
				...editorOptions.hover,
				delay: undefined === value ? DEFAULT_DELAY : toNumber( value, 0, 3000 ),
			},
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Hover Delay (ms)', 'custom-html-block-extension' ) }
			group="hover"
			value={ editorOptions.hover.delay }
			onChange={ onChange }
			min={ 0 }
			max={ 3000 }
			step={ 50 }
			defaultValue={ 300 }
			options={ [
				{
					image: 'editor-options/hover/delay_1.gif',
					value: 300,
				},
				{
					image: 'editor-options/hover/delay_2.gif',
					value: 1500,
				},
			] }
			help={ {
				description: __(
					'Controls the delay in milliseconds after which the hover is shown.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
