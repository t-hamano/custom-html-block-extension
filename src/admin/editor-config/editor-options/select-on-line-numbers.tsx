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

export default function SelectOnLineNumbers() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			selectOnLineNumbers: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Select On Line Numbers', 'custom-html-block-extension' ) }
			value={ editorOptions.selectOnLineNumbers }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/select-on-line-numbers_1.gif',
				},
				{
					value: false,
					image: 'editor-options/select-on-line-numbers_2.gif',
				},
			] }
			help={ {
				description: __(
					'Controls whether the corresponding line is selected when clicking on the line number.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
