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

export default function LineNumbersMinChars() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			lineNumbersMinChars: value ? toNumber( value, 1, 10 ) : 5,
		} );
	};

	return (
		<SettingItem
			control="range"
			name="lineNumbersMinChars"
			label={ __( 'Line Numbers Min Chars', 'custom-html-block-extension' ) }
			value={ editorOptions.lineNumbersMinChars }
			onChange={ onChange }
			min={ 1 }
			max={ 10 }
			defaultValue={ 5 }
			help={ {
				description: __(
					'Controls the width of line numbers, by reserving horizontal space for rendering at least an amount of digits.',
					'custom-html-block-extension'
				),
				image: 'editor-options/line-numbers-min-chars.gif',
			} }
		/>
	);
}
