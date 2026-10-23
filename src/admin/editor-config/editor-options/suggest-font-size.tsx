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

export default function SuggestFontSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			suggestFontSize: value ? toNumber( value, 10, 30 ) : 14,
		} );
	};

	return (
		<SettingItem
			control="range"
			label={ __( 'Suggest Font Size (px)', 'custom-html-block-extension' ) }
			value={ editorOptions.suggestFontSize }
			onChange={ onChange }
			min={ 10 }
			max={ 30 }
			defaultValue={ 14 }
			help={ {
				description: __( 'Font size for the suggest widget.', 'custom-html-block-extension' ),
				items: [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'10'
						),
						image: 'editor-options/suggest-font-size_1.jpg',
						value: 10,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							'30'
						),
						image: 'editor-options/suggest-font-size_2.jpg',
						value: 30,
					},
				],
			} }
		/>
	);
}
