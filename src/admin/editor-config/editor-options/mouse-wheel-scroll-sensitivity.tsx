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

export default function MouseWheelScrollSensitivity() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			mouseWheelScrollSensitivity: value ? toNumber( value, 1, 10 ) : 1,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Mouse Wheel Scroll Sensitivity', 'custom-html-block-extension' ),
				value: editorOptions.mouseWheelScrollSensitivity,
				onChange,
				min: 1,
				max: 10,
				defaultValue: 1,
			} }
		/>
	);
}
