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

export default function FastScrollSensitivity() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			fastScrollSensitivity: value ? toNumber( value, 1, 10 ) : 5,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Fast Scroll Sensitivity', 'custom-html-block-extension' ),
				value: editorOptions.fastScrollSensitivity,
				onChange,
				min: 1,
				max: 10,
				defaultValue: 5,
			} }
		/>
	);
}
