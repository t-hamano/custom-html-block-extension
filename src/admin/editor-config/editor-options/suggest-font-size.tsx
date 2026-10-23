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

export default function SuggestFontSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			suggestFontSize: undefined !== value ? toNumber( value, 0, 30 ) : 0,
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Suggest Font Size (px)', 'custom-html-block-extension' ) }
			value={ editorOptions.suggestFontSize }
			onChange={ onChange }
			min={ 0 }
			max={ 30 }
			defaultValue={ 0 }
			controlHelp={ __( "0 uses the editor's font size.", 'custom-html-block-extension' ) }
			options={ [
				{
					image: 'editor-options/suggest-font-size_1.jpg',
					value: 10,
				},
				{
					image: 'editor-options/suggest-font-size_2.jpg',
					value: 30,
				},
			] }
			help={ {
				description: __( 'Font size for the suggest widget.', 'custom-html-block-extension' ),
			} }
		/>
	);
}
