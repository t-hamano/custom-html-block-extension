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

export default function FontSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			fontSize: value ? toNumber( value, 10, 30 ) : 14,
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Font Size (px)', 'custom-html-block-extension' ) }
			value={ editorOptions.fontSize }
			onChange={ onChange }
			min={ 10 }
			max={ 30 }
			defaultValue={ 14 }
		/>
	);
}
