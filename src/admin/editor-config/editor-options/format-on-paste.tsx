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

export default function FormatOnPaste() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			formatOnPaste: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="formatOnPaste"
			label={ __( 'Format On Paste', 'custom-html-block-extension' ) }
			value={ editorOptions.formatOnPaste }
			onChange={ onChange }
			defaultValue={ false }
			options={ [
				{
					value: true,
					image: 'editor-options/format-on-paste_1.gif',
					description: __(
						'Pasted content is automatically formatted to match the surrounding code.',
						'custom-html-block-extension'
					),
				},
				{
					value: false,
					image: 'editor-options/format-on-paste_2.gif',
					description: __(
						'Pasted content is inserted as is, without formatting.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether the editor should automatically format the pasted content.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
