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

export default function UseTabStops() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			useTabStops: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="useTabStops"
			label={ __( 'Use Tab Stops', 'custom-html-block-extension' ) }
			value={ editorOptions.useTabStops }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					image: 'editor-options/use-tab-stops_1.gif',
					description: __(
						'Indenting with Tab aligns to the next tab stop, and Backspace within the indentation deletes back to the previous tab stop.',
						'custom-html-block-extension'
					),
					value: true,
				},
				{
					image: 'editor-options/use-tab-stops_2.gif',
					description: __(
						'Indenting with Tab always adds a full Tab Size of indentation, and Backspace deletes one character at a time.',
						'custom-html-block-extension'
					),
					value: false,
				},
			] }
			help={ {
				description: __(
					'Spaces and tabs are inserted and deleted in alignment with tab stops.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
