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

export default function WordWrapColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			wordWrapColumn: value ? toNumber( value, 20, 200 ) : 80,
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Word Wrap Column', 'custom-html-block-extension' ) }
			value={ editorOptions.wordWrapColumn }
			onChange={ onChange }
			min={ 20 }
			max={ 200 }
			defaultValue={ 80 }
			help={ {
				description: __(
					'Controls the wrapping column of the editor.',
					'custom-html-block-extension'
				),
				image: 'editor-options/word-wrap-column.gif',
			} }
		/>
	);
}
