/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function RoundedSelection() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			roundedSelection: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Rounded Selection', 'custom-html-block-extension' ) }
			value={ editorOptions.roundedSelection }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/rounded-selection_1.jpg',
				},
				{
					value: false,
					image: 'editor-options/rounded-selection_2.jpg',
				},
			] }
			help={ {
				description: __(
					'Controls whether selections should have rounded corners.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
