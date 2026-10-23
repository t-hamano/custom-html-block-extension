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

export default function TabSize() {
	const { editorSettings, setEditorSettings } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorSettings( {
			...editorSettings,
			tabSize: value ? toNumber( value, 1, 8 ) : 4,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Tab Size', 'custom-html-block-extension' ),
				value: editorSettings.tabSize,
				onChange,
				min: 1,
				max: 8,
				defaultValue: 4,
			} }
		/>
	);
}
