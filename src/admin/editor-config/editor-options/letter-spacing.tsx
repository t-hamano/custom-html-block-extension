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

export default function LetterSpacing() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			letterSpacing: value ? toNumber( value, -2, 2 ) : 0,
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Letter Spacing (px)', 'custom-html-block-extension' ) }
			value={ editorOptions.letterSpacing }
			onChange={ onChange }
			min={ -2 }
			max={ 2 }
			step={ 0.1 }
			defaultValue={ 0 }
		/>
	);
}
