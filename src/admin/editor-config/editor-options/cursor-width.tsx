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

export default function CursorWidth() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			cursorWidth: value ? toNumber( value, 2, 10 ) : 2,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Cursor Width (px)', 'custom-html-block-extension' ),
				value: editorOptions.cursorWidth,
				onChange,
				min: 2,
				max: 10,
				defaultValue: 2,
			} }
		/>
	);
}
