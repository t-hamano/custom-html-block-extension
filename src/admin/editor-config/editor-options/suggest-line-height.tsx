/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { toNumber } from '../../../lib/helper';
import SettingItem from '../components/setting-item';

export default function SuggestLineHeight() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			suggestLineHeight: undefined !== value ? toNumber( value, 0, 60 ) : 0,
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Suggest Line Height (px)', 'custom-html-block-extension' ) }
			value={ editorOptions.suggestLineHeight }
			onChange={ onChange }
			min={ 0 }
			max={ 60 }
			defaultValue={ 0 }
			controlHelp={ __( "0 uses the editor's line height.", 'custom-html-block-extension' ) }
			help={ {
				description: __( 'Line height for the suggest widget.', 'custom-html-block-extension' ),
				items: [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'10'
						),
						image: 'editor-options/suggest-line-height_1.jpg',
						value: 10,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'30'
						),
						image: 'editor-options/suggest-line-height_2.jpg',
						value: 30,
					},
				],
			} }
		/>
	);
}
